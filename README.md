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

### Article

Describes the majority of content on the site. One article object contains information to be shown on a single subpage of the site, for example a single restaurant. All articles must have a title, a slug, and a parent **Listing page**. The article content may be edited through a what-you-see-is-what-you-get (WYSIWYG) editor, and it will be rendered on the built site looking very similar to how it looks in the Flamelink editor. Furthermore the **Article** schema has optional fields which may be provided only if they apply, such as tags, copyright disclaimers, opening hours, contact info, and a location. Hovever, these can be left blank when not used.

### Listing Page

A grouping of related **Article** objects. For example, if you have several articles which all represent different restaurants, you would provide them all with a parent listing page named "Restaurants". In many ways, the **Listing Page** may be thought of as a *category* of **Article**. A single listing page will show a list of all its child articles, with the ability to filter the list view by the article's tags.

### Page

A single, standalone page displaying content that does not conform to the other schema types. The content is customizable through Flamelink's WYSIWYG editor, and will be rendered on the site very similar to how it looks in the editor. An example use case is the site's "About us" page, which contains some rich text and a few images, which are entered to the page's **Content** field. If we were to write "about-us" in the page's **Slug** field, then the content will be rendered on a standalone page located at `trondheim.no/about-us`.

### Copyright

If you need to add a copyright disclaimer at the bottom of an **Article**, then you may create one using the **Copyright** schema. When you have created your copyright disclaimer, navigate to the **Article** in which you want it shown, find the article's **Copyright** field and select the one you created.

### Layout

A grouping of different schemas representing the layout of different pages, such as the **Front Page** and the **Student Page**. Any information related to the pages that are not auto-generated will be stored in a schema within the **Layout** group.

### Navbar

Contains information about the site's menu bar.

### Default thumbnails

For each schema to which it applies, select a default thumbnail to be shown for objects which does not have a specified thumbnail.


## Frontend (React.js + Gatsby.js)

## Gatsby Cloud

## Netlify


