# Documentation

## Architecture

This site uses four technologies: Flamelink, Gatsby Cloud and Netlify in addition to the front-end, which is build using React.js and Gatsby.js. In this section we will provide a brief overview of the role of each module, and in the subsequent sections we will describe each one in more detail.

[Flamelink](https://flamelink.io) is the content management system (CMS), and it is the most important module to the editors of the site's content. Flamelink provides a user interface through which the editor may add or update the site's content without needing any knowledge of programming or the rest of the site's architecture.

The frontend is the codebase stored in this Guthub repo, and it contains the code determining how the site will appear to the end users. The codebase is written in React.js using a framework called Gatsby.js. Developers who are maintaining this site should read through the "Frontend" section of this README.

The [Gatsby Cloud](https://gatsbyjs.com) platform pulls the codebase from this Github repo, and builds the site. These builds are triggered whenever there is a change in the codebase, or when there is a change in Flamelink content.

Whenever Gatsby Cloud successfully builds the site, it is deployed to [Netlify](https://netlify.com). Netlify deploys the site so that it is accessible through the web.

![Architecture Diagram](/static/images/trondheim-no-architecture.png)

## Flamelink (Headless CMS)

If you are a content editor of this site, then your first step should be to familiarize yourself with [Flamelink](https://flamelink.io). This site pulls data from a Flamelink project named **TRONDHEIM.NO** with project-id **byportal-218506**. The site's administrators should provide you with the required login credentials to access the project. Once you have logged in and accessed the project, then you should see an overview of all the content grouped by schema.

As an editor, you should become familiar with the "content" section of Flamelink (accessible through the sidebar menu). This is where you add, update, and delete the content that should be shown on the page. Below is a reference guide for the different schema types and their functions.

#### Article

Describes the majority of content on the site. One article object contains information to be shown on a single subpage of the site, for example a single restaurant. All articles must have a title, a slug, and a parent **Listing page**. The article content may be edited through a what-you-see-is-what-you-get (WYSIWYG) editor, and it will be rendered on the built site looking very similar to how it looks in the Flamelink editor. Furthermore the **Article** schema has optional fields which may be provided only if they apply, such as tags, copyright disclaimers, opening hours, contact info, and a location. Hovever, these can be left blank when not used.

#### Listing Page

A grouping of related **Article** objects. For example, if you have several articles which all represent different restaurants, you would provide them all with a parent listing page named "Restaurants". In many ways, the **Listing Page** may be thought of as a _category_ of **Article**. A single listing page will show a list of all its child articles, with the ability to filter the list view by the article's tags.

#### Page

A single, standalone page displaying content that does not conform to the other schema types. The content is customizable through Flamelink's WYSIWYG editor, and will be rendered on the site very similar to how it looks in the editor. An example use case is the site's "About us" page, which contains some rich text and a few images, which are entered to the page's **Content** field. If we were to write "about-us" in the page's **Slug** field, then the content will be rendered on a standalone page located at `trondheim.no/about-us`.

#### Copyright

If you need to add a copyright disclaimer at the bottom of an **Article**, then you may create one using the **Copyright** schema. When you have created your copyright disclaimer, navigate to the **Article** in which you want it shown, find the article's **Copyright** field and select the one you created.

#### Layout

A grouping of different schemas representing the layout of different pages, such as the **Front Page** and the **Student Page**. Any information related to the pages that are not auto-generated will be stored in a schema within the **Layout** group.

#### Navbar

Contains information about the site's menu bar.

#### Default thumbnails

For each schema to which it applies, select a default thumbnail to be shown for objects which does not have a specified thumbnail.

## Frontend (React.js + Gatsby.js)

If you are a developer who wish to make changes to the code, start with the following steps

#### Set up environment

1. Clone this repository by running `git clone https://github.com/leevi978/trondheim-demo.git`
2. Navigate to the cloned repo's folder by running `cd trondheim-demo`
3. Install all of the required node modules by running `npm install`
4. Acquire the following environment variables, and add them to files for the development and production environments, named `.env.development` and `.env.production`, respectfully, both located in the root folder of the project. They may be obtained from the Gatsby Cloud project's environment variables.

   - GATSBY_FLAMELINK_CLIENT_EMAIL
   - GATSBY_FLAMELINK_DATABASE_URL
   - GATSBY_FLAMELINK_PRIVATE_KEY
   - GATSBY_FLAMELINK_PROJECT_ID
   - GATSBY_FLAMELINK_STORAGE_BUCKET
   - GATSBY_GOOGLE_API
   - GATSBY_CONCURRENT_DOWNLOAD
   - GOOGLE_APPLICATION_CREDENTIALS

#### Running locally

There are two main ways through which you can run the site locally on your computer.

- **Develop** mode is run by executing `gatsby develop`. This mode pulls data from Flamelink and builds the site once, then re-renders the site using the same data each time code changes are detected. This is the best way when you are developing new features, or troubleshooting and/or fixing bugs, because it allows you to see code changes in real time. If you need to re-build often, it is recommended to set the environment variable `TEST` to true and `TEST_IMAGE_URL` to an url linking to a very small image in the `.env.development` file, in order to reduce build time. The site will be hosted on `localhost:8000`.

- If you want to **Build** the site to see how it will function in production, run `gatsby build` in order to build the static site files, and then run `gatsby serve` in order to serve the built site on `localhost:9000`. This mode does not provide live update as code is changed, but provides a view of how the site will appear in production.

## Gatsby Cloud

[Gatsby Cloud](https://gatsbyjs.com) pulls the code from a specified branch of this Github repository. Log in to the platform using credentials provided by your administrator, or have the administrator invite you to the Gatsby Cloud project as a collaborator. Enter the Gatsby Cloud project dashboard named `trondheim-demo` and you will get an overview of all previous an ongoing builds of the site. For each build, you may access a build log, so that if something goes wrong, you should be able to access the specific error message if there is one.

#### Choosing repository

You may choose which repository the Gatsby Cloud project should pull code from by accessing `site-settings -> general` and then edit `site details`. By default, the project will usually point to the `master` branch, which contains production-ready code.

#### Inviting contributors

To provide another user with access to the Gatsby Cloud project, go to `site-settings -> general` and then click `invite contributor`.

#### Edit environment variables

To edit the environment variables used in production, go to `site-settings -> general` and scroll down to see the `environment variables` field. Change these variables only if necessary!

#### Enable / Disable builds

If you for some reason need to enable or disable builds, go to `site-settings -> builds` and select or deselect `builds`. The previously built sites will still be available and deployed to Netlify, but future builds will only trigger if the `builds` field is selected.

## Netlify

[Netlify](https://netlify.com) simply deploys the site after it has been built by Gatsby Cloud. Netlify will have a log of previous successful and attempted builds, but will only deploy the ones that were successful. Access the Netlify project named `trondheim-no` using credentials provided by your administrator.

#### Deploy a previous build

If you for some reason need to roll back to deploy a previous deploy, enter the project and navigate to the `deploys` tab where you will see a list of previous deploys. Click on the deploy you wish to publish and select `publish deploy`. You may also lock publishing to a single deploy, so that new deploys aren't published automatically.
