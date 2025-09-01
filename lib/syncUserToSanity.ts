import { client } from "@/client";

function generateReferralCode() {
    return Math.random().toString(36).substring(2, 8).toUpperCase(); // 6-char code
}

async function getUniqueReferralCode() {
    let code = generateReferralCode();
    let exists = await client.fetch(
        `count(*[_type == "user" && referralCode == $code])`,
        { code }
    );
    while (exists > 0) {
        code = generateReferralCode();
        exists = await client.fetch(
            `count(*[_type == "user" && referralCode == $code])`,
            { code }
        );
    }
    return code;
}

export async function syncUserToSanity(user: any) {
    console.log("syncUserToSanity called for user:", user.id);

    const email = user.emailAddresses[0]?.emailAddress || "";

    // Check if user exists by Clerk ID OR Email
    const existingUser = await client.fetch(
        `*[_type == "user" && (clerkId == $clerkId || email == $email)][0]`,
        { clerkId: user.id, email }
    );

    if (!existingUser) {
        let referralCode = user.publicMetadata?.referralCode || await getUniqueReferralCode();

        const newUser = {
            _type: "user",
            clerkId: user.id,
            fullName: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
            userName: user?.username,
            firstName: user?.firstName,
            lastName: user?.lastName,
            email,
            avatarUrl: user.imageUrl,
            phoneNumber: user.phoneNumbers?.[0]?.phoneNumber || "",
            referralCode,
            points: 0,
            location: "",
            language: "",
        };

        const updatedMetadata = {
            fullName: newUser.fullName,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            userName: newUser.userName,
            email: newUser.email,
            avatarUrl: newUser.avatarUrl,
            points: 0,
            referralCode: newUser.referralCode,
            phoneNumber: newUser.phoneNumber,
            location: "",
            language: "",
        };

        console.log("Creating user in Sanity:", newUser);
        await client.create(newUser);
        await user.updateMetadata({ publicMetadata: updatedMetadata });
        console.log("User created successfully in Sanity");
    } else {
        console.log("User already exists in Sanity:", existingUser._id);

        // Optional: update Clerk metadata if missing
        const updatedMetadata = {
            fullName: existingUser.fullName,
            firstName: existingUser.firstName,
            lastName: existingUser.lastName,
            userName: existingUser.userName,
            email: existingUser.email,
            avatarUrl: existingUser.avatarUrl,
            referralCode: existingUser.referralCode,
            phoneNumber: existingUser.phoneNumber,
            points: existingUser.points || 0,
            location: existingUser.location || "",
            language: existingUser.language || "",
        };

        await user.updateMetadata({ publicMetadata: updatedMetadata });
    }
}

export async function checkUserExistsInSanity(
    clerkId?: string,
    email?: string
): Promise<boolean> {
    if (!clerkId && !email) return false;

    const user = await client.fetch(
        `*[_type == "user" && (clerkId == $clerkId || email == $email)][0]`,
        { clerkId, email }
    );

    return !!user;
}