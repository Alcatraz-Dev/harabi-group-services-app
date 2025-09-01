import {createClient} from "@sanity/client";


export const client = createClient({
  projectId: "mperdl2r",
  dataset: "production",
  apiVersion: "2024-01-01",
  useCdn: false,
  token: 'sk6wsUJBpQzPVke39UPHZN9nxRxhCeWp6DdvSSXnqP5oWECLJ4q8cJmJ8nkTl4OuiakpaUXbNSbnUWQbuWZMZRqcFktflIeE0easLf8mma72hYyeqkz0wIxSivVE7ejMFuKiSJ2d2B2n7rVOTCFC8lTQuobnKj0clZE9OEnwGLlTXP4FNhrQ',
});