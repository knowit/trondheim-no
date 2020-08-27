# Documentation




## Architecture

This site uses four technologies: Flamelink, Gatsby Cloud and Netlify in addition to the front-end, which is build using React.js and Gatsby.js. In this section we will provide a brief overview of the role of each module, and in the subsequent sections we will describe each one in more detail. 

![Trondheim-no Architecture Diagram](/static/images/trondheim-no-architexture.png)

[Flamelink](https://flamelink.io) is the content management system (CMS), and it is the most important module to the editors of the site's content. Flamelink provides a user interface through which the editor may add or update the site's content without needing any knowledge of programming or the rest of the site's architecture.

The frontend is the codebase stored in this Guthub repo, and it contains the code determining how the site will appear to the end users. The codebase is written in React.js using a framework called Gatsby.js. Developers who are maintaining this site should read through the "Frontend" section of this README.

The [Gatsby Cloud](https://gatsbyjs.com) platform pulls the codebase from this Github repo, and builds the site. These builds are triggered whenever there is a change in the codebase, or when there is a change in Flamelink content.

Whenever Gatsby Cloud successfully builds the site, it is deployed to [Netlify](https://netlify.com). Netlify deploys the site so that it is accessible through the web.


## Flamelink (CMS)

## Frontend (React.js + Gatsby.js)

## Gatsby Cloud

## Netlify


