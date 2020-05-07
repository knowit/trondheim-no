
import React from 'react';
import LocalizationHelper from "../helpers/helpers"
import { Link } from 'gatsby';
import Img from "gatsby-image"


const selectedStyle = {backgroundColor: 'grey', color: 'white'};
const unSelectedStyle = {backgroundColor: 'darkgrey', color: 'black'};

export default class SortableArticleView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filterTags: [],
            sortBy: "standard"
        };
    }

  render() {
    return (
        <div>
            <TagFilter 
                pageContext={this.props.pageContext}
                filterTags={this.state.filterTags}
            />
            <Sorter 
                pageContext={this.props.pageContext}
                sortBy={this.state.sortBy}
            />
            <ArticleList 
                articles={this.props.pageContext.articles} 
                pageContext={this.props.pageContext}
                filterTags={this.state.filterTags}
                sortBy={this.state.sortBy}
            />
        </div>
    );
  }
}

class TagFilter extends React.Component {
    render() {
        const pageContext = this.props.pageContext;
        const filterTags = this.props.filterTags;
        const allTags = [];

        allTags.push(
            <div class="distinct-tag" style={filterTags.length == 0 ? selectedStyle : unSelectedStyle}>
                {LocalizationHelper.getLocalWord(pageContext.localization, "all", pageContext.locale)}
            </div>
        )

        pageContext.tags.forEach((tag) => {
            allTags.push(
            <div class="distinct-tag" style={filterTags.includes(tag) ? selectedStyle : unSelectedStyle}>
                {tag}
            </div>)
        })

        return(
            <div id="all-tags-container">
                {allTags}    
            </div>
        )
    }
}

class Sorter extends React.Component {
    render() {
        const pageContext = this.props.pageContext;
        const sortBy = this.props.sortBy;

        return(
            <div>
                <div class="distinct-tag" style={sortBy == "standard" ? selectedStyle : unSelectedStyle}>{LocalizationHelper.getLocalWord(pageContext.localization, "standard", pageContext.locale)}</div>
                <div class="distinct-tag" style={sortBy == "date" ? selectedStyle : unSelectedStyle}>{LocalizationHelper.getLocalWord(pageContext.localization, "date", pageContext.locale)}</div>
                <div class="distinct-tag" style={sortBy == "title" ? selectedStyle : unSelectedStyle}>{LocalizationHelper.getLocalWord(pageContext.localization, "title", pageContext.locale)}</div>
                <div class="distinct-tag" style={sortBy == "random" ? selectedStyle : unSelectedStyle}>{LocalizationHelper.getLocalWord(pageContext.localization, "random", pageContext.locale)}</div>
            </div>
        )
    }
}

class ArticleList extends React.Component {
    render() {
        const filterTags = this.props.filterTags;
        const sortBy = this.props.sortBy;
        const pageContext = this.props.pageContext;
        const articleViews = [];

        this.props.articles.forEach((article) => {
            //Add article to array only if it contains a tag chosen, or ALL is chosen (empty list).
            if(filterTags.length == 0 || article.tags.some(r => filterTags.includes(r))){
                articleViews.push(
                    <ArticleView article={article} pageContext={pageContext}/>
                )
            }
        });

        return (
            <div id="articles-container">
                {articleViews}
            </div>
        )
    }
}

class ArticleView extends React.Component {
    render(){
        const article = this.props.article;
        const pageContext = this.props.pageContext;

        return (
            <div class="article-container">
              <Img className="article-thumbnail" fluid={article.thumbnail[0]?.localFile.childImageSharp.fluid} />
              <div class="article-info-container">
                <h2><Link to={`${pageContext.parentPath}${pageContext.node.slug}/${article.slug}`}>{article.title}</Link></h2>
                <div class="tags-container">
                  {article.tags.map(function (tag, key) {
                    return (
                      <div class="tag">
                        <a href="/">{tag}</a>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          )
    }
}
