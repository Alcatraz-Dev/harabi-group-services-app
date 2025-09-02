import { client } from "@/client";

function generateReferralCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
}

async function getUniqueReferralCode() {
    let code = generateReferralCode();
    console.log("Generated referral code:", code);

    let exists = await client.fetch(
        `count(*[_type == "user" && referralCode == $code])`,
        { code }
    );
    console.log("Code exists check:", exists);

    while (exists > 0) {
        code = generateReferralCode();
        console.log("Regenerating code:", code);
        exists = await client.fetch(
            `count(*[_type == "user" && referralCode == $code])`,
            { code }
        );
    }
    return code;
}

export async function syncUserToSanity(user: any) {
    console.log("🔍 Starting syncUserToSanity with user:", user?.id);

    if (!user) {
        console.log("❌ No user provided");
        return;
    }

    const email = user.emailAddresses[0]?.emailAddress || "";
    console.log("User email:", email);

    try {
        // Use the updated check function
        const existingUser = await checkUserExistsInSanity(user.id, email);

        if (!existingUser) {
            console.log("🆕 Creating new user in Sanity...");

            const referralCode = await getUniqueReferralCode();
            const referredBy = user.referredBy;
            console.log("Using referral code:", referralCode);

            const newUser = {
                _type: "user",
                clerkId: user.id,
                fullName: `${user.firstName || ""} ${user.lastName || ""}`.trim(),
                firstName: user.firstName,
                lastName: user.lastName,
                email: email,
                avatarUrl: user.imageUrl,
                points: 0,
                location: "",
                language: "sv",
                referralCode: referralCode,
                referredBy: referredBy,
            };

            console.log("New user object:", JSON.stringify(newUser, null, 2));

            try {
                const createdUser = await client.create(newUser);
                console.log("✅ User created successfully in Sanity:", createdUser._id);

                // Update Clerk metadata
                try {
                    await user.update({
                        unsafeMetadata: {
                            fullName: newUser.fullName,
                            firstName: newUser.firstName,
                            lastName: newUser.lastName,
                            email: newUser.email,
                            avatarUrl: newUser.avatarUrl,
                            location: "",
                            language: "sv",
                            points: "0",
                            referralCode: referralCode,
                            referredBy: referredBy,
                        }
                    });
                    console.log("✅ Clerk metadata updated");
                } catch (metaError) {
                    console.error("❌ Failed to update Clerk metadata:", metaError);
                }

            } catch (createError) {
                console.error("❌ Error creating user in Sanity:", createError);
                throw createError;
            }

        } else {
            console.log("ℹ️ User already exists in Sanity");
        }
    } catch (error) {
        console.error("❌ Error in syncUserToSanity:", error);
        throw error;
    }
}

export async function checkUserExistsInSanity(
    clerkId?: string,
    email?: string
): Promise<boolean> {
    console.log("🔍 Checking if user exists:", { clerkId, email });

    if (!clerkId && !email) return false;

    try {
        // Build query based on available parameters
        let query;
        let params: any = {};

        if (clerkId && email) {
            query = `*[_type == "user" && (clerkId == $clerkId || email == $email)][0]`;
            params = { clerkId, email };
        } else if (clerkId) {
            query = `*[_type == "user" && clerkId == $clerkId][0]`;
            params = { clerkId };
        } else if (email) {
            query = `*[_type == "user" && email == $email][0]`;
            params = { email };
        } else {
            return false;
        }

        console.log("Executing query:", query, "with params:", params);

        const user = await client.fetch(query, params);
        console.log("User exists check result:", !!user);
        return !!user;
    } catch (error) {
        console.error("❌ Error in checkUserExistsInSanity:", error);
        return false;
    }
}