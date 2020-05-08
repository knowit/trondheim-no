
import React from 'react';
import LocalizationHelper from "../helpers/helpers"
import { Link } from 'gatsby';
import Img from "gatsby-image"


const selectedStyle = {backgroundColor: 'grey', color: 'white'};
const unSelectedStyle = {backgroundColor: 'darkgrey', color: 'black'};
const SORT_TYPES = ["standard", "date", "title", "random"];

export default class SortableArticleView extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            filterTags: [],
            sortBy: "standard"
        };

        this.handleTagToggle = this.handleTagToggle.bind(this);
        this.handleSortToggle = this.handleSortToggle.bind(this);
    }

    handleTagToggle(tag){
        let filterTags = this.state.filterTags;
        if(tag == "all") filterTags = [];
        else {
            var indexOf = filterTags.findIndex((e)=>e==tag);
            if(indexOf == -1) filterTags.push(tag);
            else filterTags.splice(indexOf,1);
        }
        this.setState({filterTags: filterTags});
    }

    handleSortToggle(sort){
        this.setState({sortBy:sort});
    }

    render() {
        return (
            <div>
                <TagFilter 
                    pageContext={this.props.pageContext}
                    filterTags={this.state.filterTags}
                    onTagToggle={this.handleTagToggle}
                />
                <Sorter 
                    pageContext={this.props.pageContext}
                    sortBy={this.state.sortBy}
                    onSortToggle={this.handleSortToggle}
                />
                <ArticleList 
                    articles={this.props.pageContext.articles} 
                    subListingPages={this.props.pageContext.subListingPages}
                    pageContext={this.props.pageContext}
                    filterTags={this.state.filterTags}
                    sortBy={this.state.sortBy}
                />
            </div>
        );
    }
}

class TagFilter extends React.Component {

    constructor(props) {
        super(props);
        this.handleTagToggle = this.handleTagToggle.bind(this);
    }

    handleTagToggle(tag, e) {
        e.preventDefault();
        this.props.onTagToggle(tag)
    }

    render() {
        const pageContext = this.props.pageContext;
        const filterTags = this.props.filterTags;
        const allTags = [];

        allTags.push(
            <div 
                class="distinct-tag" 
                style={filterTags.length == 0 ? selectedStyle : unSelectedStyle}
                onClick={(e) => this.handleTagToggle("all", e)}>
                    {LocalizationHelper.getLocalWord(pageContext.localization, "all", pageContext.locale)}
            </div>
        )

        pageContext.tags.forEach((tag) => {
            allTags.push(
            <div 
                class="distinct-tag" 
                style={filterTags.includes(tag) ? selectedStyle : unSelectedStyle}
                onClick={(e) => this.handleTagToggle(tag, e)}>
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

    constructor(props) {
        super(props);
        this.handleSortToggle = this.handleSortToggle.bind(this);
    }

    handleSortToggle(tag, e) {
        e.preventDefault();
        this.props.onSortToggle(tag)
    }

    render() {
        const pageContext = this.props.pageContext;
        const sortBy = this.props.sortBy;
        const sortTags = [];

        SORT_TYPES.forEach(s => {
            sortTags.push(
                <div 
                    class="distinct-tag" 
                    style={sortBy == s ? selectedStyle : unSelectedStyle}
                    onClick={(e) => this.handleSortToggle(s, e)}
                    >
                        {LocalizationHelper.getLocalWord(pageContext.localization, s, pageContext.locale)}
                </div>
            );
        });

        return(
            <div>
                {sortTags}
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

        this.props.subListingPages.forEach((slp) => {
            slp.tags = [];
            if(filterTags.length == 0){
                articleViews.push(
                    <ArticleView article={slp} pageContext={pageContext} subList={true}/>
                )
            }
        })

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
                <h2><Link to={`${pageContext.parentPath}${pageContext.node.slug}/${article.slug}`}>{(this.props.subList) ? article.navigationTitle : article.title}</Link></h2>
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
