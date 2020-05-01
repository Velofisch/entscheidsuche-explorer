import React, { Component } from 'react'
import { extend } from 'lodash'
import {
  SearchkitManager, SearchkitProvider,
  SearchBox, RefinementListFilter, Pagination,
  HitsStats, NoHits, ResetFilters, RangeFilter, 
  ViewSwitcherHits, ViewSwitcherToggle, 
  GroupedSelectedFilters, Layout, TopBar, 
  LayoutBody, LayoutResults, ActionBar, 
  ActionBarRow, SideBar
} from 'searchkit'

import './index.css'

// elasticsearch host
//
// const host = "https://search-siroop-3jjelqkbvwhzqzsolxt5ujxdxm.eu-central-1.es.amazonaws.com"
const host = "https://juniper-917791610.eu-west-1.bonsaisearch.net/verdict";
// const host = "http://localhost:9200/verdict";

const searchkit = new SearchkitManager(host);


// location of all resources
//
const baseUrl = "https://e.entscheidsuche.ch/";


//
// some helper functions for extracting data
//


// build a document url with a default
const documentUrl = (source) => {
  let url = baseUrl;
  if (source.document_path) {
    url = baseUrl + source.document_path
  }
  return url
};

const thumbUrl = (source) => {
  if (source.document_filename.endsWith('pdf')) {
    return 'pdf.svg'
  } else {
    return 'html.svg'
  }
  // if (source.contents && source.contents.previewImage && source.contents.previewImage.small) {
  //   thumb = baseUrl + source.contents.previewImage.small
  // }
};

const cantonThumbUrl = (source) => {
  const url = 'cantons/' + source.canton + '.svg';
  return url;
  // if (source.contents && source.contents.previewImage && source.contents.previewImage.small) {
  //   thumb = baseUrl + source.contents.previewImage.small
  // }
};


// const thumbUrl = (source) => {
//   let thumb = baseUrl;
//   if (source.contents && source.contents.previewImage && source.contents.previewImage.small) {
//     thumb = baseUrl + source.contents.previewImage.small
//   }
//   return thumb
// }

// const extractTitle = (source) => {
//   // return source['meta.title.decomp'] ? source['meta.title.decomp'] : source.meta.title;
//   debugger;
//   return source.document_title;
// };

// const extractText = (source) => {
//   // return source['meta.text.decomp'] ? source['meta.text.decomp'] : source.meta.text;
//   return source.content.full_text;
// };

const VerdictHitsGridItem = (props) => {
  const { bemBlocks, result } = props;

  const source = extend({}, result._source, result.highlight);

  // debugger;

  let url = documentUrl(source);
  let thumbImg = thumbUrl(source);
  let cantonThumbImg = cantonThumbUrl(source);
  // let thumb = thumbUrl(source);
  // let title = extractTitle(source);

  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <a href={url} target="_blank">

        <img data-qa="poster" alt="presentation" className={bemBlocks.item("poster")} src={cantonThumbImg} width="34" height="48" />
        <img data-qa="poster" alt="presentation" className={bemBlocks.item("poster")} src={thumbImg} width="34" height="48" />
        <div data-qa="title" className={bemBlocks.item("title")}>{source.canton} - {source.court_code}</div>
        <div data-qa="title" className={bemBlocks.item("title")}>{source.document_created_date}</div>
        <div data-qa="title" className={bemBlocks.item("title")}>{source.document_title}</div>
        <div data-qa="title" className={bemBlocks.item("title")}>{source.document_filename}</div>
        {/*<div data-qa="title" className={bemBlocks.item("text")} dangerouslySetInnerHTML={{ __html: source.content.full_text }}/>*/}
      </a>
    </div>
  )
};

const VerdictHitsListItem = (props) => {
  const { bemBlocks, result } = props;

  const source = extend({}, result._source, result.highlight);

  // debugger;

  let url = documentUrl(source);
  let thumbImg = thumbUrl(source);
  let cantonThumbImg = cantonThumbUrl(source);

  // let thumb = thumbUrl(source)
  // let title = extractTitle(source);
  // let text = extractText(source);

  let textExtract;
  if (source['contents.extractedText']) {
    textExtract =
      <div>
        <h3 className={bemBlocks.item("subtitle")}>Ausschnitt:</h3>
        <div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{ __html: source['contents.extractedText'] }}/>
      </div>
  } else {
    textExtract = <div/>
  }

  let hl;
  if (result.highlight && result.highlight['content.full_text']) {

    hl =
    result.highlight['content.full_text'].map(function(d, idx) {
      return (<div key={idx} data-qa="title" className={bemBlocks.item("text")} dangerouslySetInnerHTML={{ __html: d }}/>)
    });
  }

  return (
    <div className={bemBlocks.item().mix(bemBlocks.container("item"))} data-qa="hit">
      <div className={bemBlocks.item("poster")}>
        {/*<img alt="presentation" data-qa="poster" src={thumb} />*/}
      </div>
      <div className={bemBlocks.item("details")}>
        <a href={url} target="_blank">
          <img data-qa="poster" alt="presentation" className={bemBlocks.item("poster")} src={cantonThumbImg} width="34" height="48" />
          <img data-qa="poster" alt="presentation" className={bemBlocks.item("poster")} src={thumbImg} width="34" height="48" />
          <div data-qa="title" className={bemBlocks.item("title")}>{source.canton} - {source.court_code}</div>
          <div data-qa="title" className={bemBlocks.item("title")}>{source.document_title}</div>
          <div data-qa="title" className={bemBlocks.item("title")}>{source.document_filename}</div>
        </a>
        {hl}

        {/*<a href={url} target="_blank"><h2 className={bemBlocks.item("title")} dangerouslySetInnerHTML={{ __html: title }}></h2></a>*/}
        {/*<h3 className={bemBlocks.item("subtitle")}>{source.meta.subject}, {source.meta.grade}, Bewertung: {source.meta.ratingNr}</h3>*/}
        {/*<h3 className={bemBlocks.item("subtitle")}>Views: {source.stats.views}, Downloads: {source.stats.downloads}</h3>*/}
        {/*<h3 className={bemBlocks.item("subtitle")}>Autor: {source.author.name}</h3>*/}
        {/*<h3 className={bemBlocks.item("subtitle")}>Text:</h3>*/}
        {/*<div className={bemBlocks.item("text")} dangerouslySetInnerHTML={{ __html: text }}></div>*/}
        {textExtract}
      </div>
    </div>
  )
};

//prefixQueryFields={["meta.title.decomp^50", "meta.text.decomp^15", "contents.extractedText"]}

class App extends Component {
  render() {
    return (
      <SearchkitProvider searchkit={searchkit}>
        <Layout>
          <TopBar>
            <SearchBox autofocus={true} searchOnChange={true}
            queryFields={["content.full_text^10"]}
            prefixQueryFields={["content.full_text^10"]}
            //prefixQueryFields={["meta.title^50", "meta.text^15", 'meta.title.decomp', 'meta.text.decomp']}
            //queryFields={["meta.title.decomp^50", "meta.text.decomp^15"]}
            />
          </TopBar>
          <LayoutBody>

            <SideBar>
              {/*<DateRangeFilter*/}
                {/*id="year"*/}
                {/*field="publication_date"*/}
                {/*title="Publication Date"*/}
                {/*min={2005}*/}
                {/*max={new Date().getFullYear()}*/}
                {/*interval="year"*/}
                {/*showHistogram={true} />*/}

              {/*<DateRangeFilter*/}
                {/*id="verdict_date"*/}
                {/*title="Urteilsdatum"*/}
                {/*fromDateField="document_created_date"*/}
                {/*toDateField="document_created_date"*/}
                {/*calendarComponent={DateRangeCalendar}*/}
                {/*fieldOptions={{*/}
                  {/*type: 'embedded',*/}
                  {/*options: {*/}
                    {/*path: 'document_created_date'*/}
                  {/*}*/}
                {/*}}*/}
              {/*/>*/}

              <RangeFilter
                id="document_year"
                field="document_year"
                min={2000}
                max={2018}
                showHistogram={true}
                title="Jahr"/>

              <RangeFilter
                id="document_month"
                field="document_month"
                min={1}
                max={12}
                showHistogram={true}
                title="Monat"/>

              <RefinementListFilter
                id="document_lang"
                title="Sprache"
                field="document_lang"
                operator="OR" />

              {/*<HierarchicalMenuFilter*/}
                {/*id="subject"*/}
                {/*title="Fach"*/}
                {/*fields={["meta.subject", "meta.topic"]}*/}
                {/*size={10} />*/}

              {/*<SignTermsFilter*/}
                {/*id="full_text_significant"*/}
                {/*title="Begriffe"*/}
                {/*label="SignTerms"*/}
                {/*fields={["content.full_text"]}*/}
                {/*size={10} />*/}

              {/*<SignRefinementListFilter*/}
                {/*id="title.words"*/}
                {/*title="Stichwörter"*/}
                {/*field="meta.title"*/}
                {/*operator="OR"*/}
                {/*size={10} />*/}

              <RefinementListFilter
                id="court_level"
                title="Level"
                field="court_level"
                operator="OR" />

              <RefinementListFilter
                id="canton"
                title="Kanton"
                field="canton"
                operator="OR" />

              <RefinementListFilter
                id="court_code"
                title="Gericht"
                field="court_code"
                operator="OR" />

              {/*<InputFilter*/}
                {/*id="author_input"*/}
                {/*title="Autor"*/}
                {/*searchThrottleTime={500}*/}
                {/*placeholder="Nach Autor suchen"*/}
                {/*searchOnChange={true}*/}
                {/*queryFields={["document_author"]} />*/}

              <RefinementListFilter
                id="author"
                title="Autor"
                field="document_author"
                operator="OR"
                size={20} />

              {/*<DynamicRangeFilter min={0} max={150} id="numDownloads" title="Downloads" field="stats.downloads" showHistogram={true} />*/}
              {/*<DynamicRangeFilter min={0} max={1500} id="numViews" title="Views" field="stats.views" showHistogram={true} />*/}
              {/*<RangeFilter min={0.0} max={5.0} id="score" title="Bewertung" field="meta.ratingNr" showHistogram={true} />*/}
              {/*<MenuFilter field={"meta.title"} title="Wörter" id="tag-cloud" listComponent={TagCloud} size={20} translations={{ "All": "Alle" }} />*/}

              {/*<RefinementListFilter id="authorList" title="Autor" field="author.name.raw" size={10} />*/}
            </SideBar>
            <LayoutResults>
              <ActionBar>

                <ActionBarRow>
                  <HitsStats translations={{
                    "hitstats.results_found": "{hitCount} Resultate gefunden"
                  }} />
                  <ViewSwitcherToggle />
                  {/*<SortingSelector options={[*/}
                    {/*{ label: "Bewertung", field: "meta.ratingNr", order: "desc" },*/}
                    {/*{ label: "Downloads", field: "stats.downloads", order: "desc" },*/}
                    {/*{ label: "Views", field: "stats.views", order: "desc" },*/}
                    {/*{ label: "Zuletzt Aufgeschaltet", field: "stats.publicationDate", order: "desc" },*/}
                    {/*{ label: "Zuerst Aufgeschaltet", field: "stats.publicationDate", order: "asc" }*/}
                  {/*]} />*/}
                </ActionBarRow>

                <ActionBarRow>
                  <GroupedSelectedFilters />
                  <ResetFilters />
                </ActionBarRow>

              </ActionBar>
              <ViewSwitcherHits
                hitsPerPage={12}
                highlightFields={["content.full_text"]}
                // sourceFilter={["plot", "title", "poster", "imdbId", "imdbRating", "year"]}
                hitComponents={[
                  { key: "grid", title: "Grid", itemComponent: VerdictHitsGridItem },
                  { key: "list", title: "List", itemComponent: VerdictHitsListItem, defaultOption: true }
                ]}
                scrollTo="body"
              />
              <NoHits suggestionsField={"content.full_text"} />
              <Pagination showNumbers={true} />
            </LayoutResults>

          </LayoutBody>
        </Layout>
      </SearchkitProvider>
    );
  }
}

export default App;
