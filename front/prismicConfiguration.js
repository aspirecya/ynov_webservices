// -- Prismic Repo Name

// -- Prismic API endpoint
// Determines which repository to query and fetch data from
// Configure your site's access point here
export const apiEndpoint = process.env.NEXT_PUBLIC_PRISMIC_ENDPOINT;

// -- Access Token if the repository is not public
// Generate a token in your dashboard and configure it here if your repository is private
export const accessToken = process.env.NEXT_PUBLIC_PRISMIC_ACESS_TOKEN;

// -- Link resolution rules
// Manages the url links to internal Prismic documents
export const linkResolver = (doc) => {
  if (doc.type === "page") {
    return `/${doc.uid}`;
  }
  return "/";
};

// -- Route Resolver rules
// Manages the url links to internal Prismic documents two levels deep (optionals)
export const Router = {
  routes: [
    {
      type: "page",
      path: "/:uid",
    },
  ],
};
