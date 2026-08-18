import React, { useEffect, useRef, useState } from "react";
import CatalogPageStore from "../../stores/catalogPage";
import thumbnailStore from "../../stores/thumbnailStore";
import { getItemUrl } from "../../services/catalog";
import Link from "../../components/link";

const CATALOG_CSS = `
.catalog-container{max-width:970px;margin:0 auto;padding:12px 0 40px;font-family:Source Sans Pro,Arial,Helvetica,sans-serif;color:#191919}
.catalog-content{clear:both}
.catalog-content .search-bars{position:relative;margin-bottom:12px;min-height:48px}
.catalog-content .search-bars .heading{display:inline-block;margin:0 16px 0 0;font-size:32px;font-weight:800;line-height:38px}
.catalog-content .search-bars .heading a{color:#191919;text-decoration:none}
.catalog-content .search-bars .buy-robux{float:right;background:#00b06f;color:#fff;border-radius:3px;padding:9px 16px;font-size:16px;font-weight:500;text-decoration:none;line-height:1.2em}
.catalog-content .search-bars .buy-robux:hover{background:#00965e;color:#fff}
.search-container{margin-top:10px}
.search-container .input-group{display:table;width:100%}
.search-container .search-input{display:table-cell;width:100%;height:38px;border:1px solid #b8b8b8;border-right:0;border-radius:3px 0 0 3px;padding:5px 12px;font-size:16px;font-weight:300;color:#191919}
.search-container .search-input:focus{border-color:#00a2ff;outline:none}
.search-container .input-group-btn{display:table-cell;width:1%;white-space:nowrap;vertical-align:top}
.input-dropdown-btn{height:38px;background:#fff;border:1px solid #b8b8b8;color:#191919;padding:0 12px;font-size:16px;min-width:160px;text-align:left;position:relative}
.input-dropdown-btn .rbx-selection-label,.input-dropdown-btn .text-overflow{display:inline-block;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:middle}
.input-dropdown-btn .icon-down-16x16{float:right;margin-top:10px;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid #191919}
.input-addon-btn{height:38px;width:38px;background:#00a2ff;border:1px solid #00a2ff;color:#fff;vertical-align:top}
.input-addon-btn .icon-search{display:inline-block;width:16px;height:16px;border:2px solid #fff;border-radius:50%;position:relative}
.input-addon-btn .icon-search:after{content:"";position:absolute;width:6px;height:2px;background:#fff;right:-4px;bottom:-1px;transform:rotate(45deg)}
.dropdown-menu{position:absolute;z-index:10;background:#fff;border:1px solid #b8b8b8;margin:0;padding:0;list-style:none;min-width:180px;box-shadow:0 2px 4px rgba(0,0,0,.15)}
.dropdown-menu li a{display:block;padding:8px 12px;color:#191919;text-decoration:none;cursor:pointer}
.dropdown-menu li a:hover{background:#00a2ff;color:#fff}
.breadcrumbs{display:flex;align-items:center;justify-content:space-between;margin:8px 0 12px}
.breadcrumb-container{list-style:none;margin:0;padding:0}
.breadcrumb-container li{float:left}
.breadcrumb-link{font-weight:500;color:#00a2ff;text-decoration:none;cursor:pointer}
.sort-menus{float:right}
.sort-dropdown{position:relative;display:inline-block}
.catalog-results .hlist{list-style:none;margin:0 -5px;padding:0}
.catalog-results .hlist:after{content:" ";display:table;clear:both}
.item-card{float:left;width:14.2857%;padding:5px;box-sizing:border-box}
.item-card-container{display:block;position:relative;background:#fff;width:100%;max-width:150px;padding:0 0 5px;text-decoration:none;color:#191919}
.item-card-thumb-container{position:relative;width:100%;padding-bottom:100%;background:#e3e3e3;overflow:hidden}
.item-card-thumb{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;border:0}
.item-card-caption{padding-top:6px}
.item-card-name{font-size:16px;font-weight:400;line-height:1.2em;max-height:2.4em;overflow:hidden;word-wrap:break-word}
.item-card-price{margin-top:3px;font-size:14px;font-weight:500}
.text-robux-tile{color:#02b757;font-weight:500}
.icon-robux{display:inline-block;width:16px;height:16px;background:url(/img/img-robux.png) no-repeat center;background-size:contain;vertical-align:middle;margin-right:3px}
.icon-limited{position:absolute;left:0;bottom:0;width:48px;height:16px;background:url(/img/CatalogOverlays/Limited.png) no-repeat;background-size:contain}
.icon-limited-unique{position:absolute;left:0;bottom:0;width:64px;height:16px;background:url(/img/CatalogOverlays/LimitedUnique.png) no-repeat;background-size:contain}
.status-new{position:absolute;top:6px;right:6px;background:#f68802;color:#fff;font-size:12px;padding:4px;border-radius:3px;z-index:1}
.section-content-off{text-align:center;padding:24px;color:#757575}
.pager{text-align:center;margin:20px 0 0;padding:0;list-style:none}
.pager li{display:inline-block;margin:0 4px}
.pager a{display:inline-block;min-width:32px;height:32px;line-height:32px;border:1px solid #b8b8b8;border-radius:3px;padding:0 10px;color:#00a2ff;text-decoration:none;cursor:pointer}
.pager .disabled a{color:#b8b8b8;cursor:default}
.faded{opacity:.25}
@media (max-width:991px){.item-card{width:20%}}
@media (max-width:767px){.item-card{width:33.333%}.catalog-content .search-bars .buy-robux{display:none}}
`;

const CATEGORIES = [
  "All Categories",
  "Featured",
  "Community Creations",
  "Collectibles",
  "Clothing",
  "Body Parts",
  "Gear",
  "Accessories",
  "Avatar Animations",
];

const SORTS = [
  { key: 0, label: "Relevance" },
  { key: 100, label: "Most Favorited" },
  { key: 101, label: "Bestselling" },
  { key: 3, label: "Recently Updated" },
  { key: 5, label: "Price (High to Low)" },
  { key: 4, label: "Price (Low to High)" },
];

const categoryToStore = (name) => {
  switch (name) {
    case "All Categories":
      return { category: "Featured", subCategory: "" };
    case "Featured":
      return { category: "Featured", subCategory: "" };
    case "Community Creations":
      return { category: "Featured", subCategory: "" };
    case "Collectibles":
      return { category: "Collectibles", subCategory: "" };
    case "Clothing":
      return { category: "Clothing", subCategory: "" };
    case "Body Parts":
      return { category: "bodyparts", subCategory: "" };
    case "Gear":
      return { category: "gear", subCategory: "" };
    case "Accessories":
      return { category: "Accessories", subCategory: "" };
    case "Avatar Animations":
      return { category: "Accessories", subCategory: "" };
    default:
      return { category: "Featured", subCategory: "" };
  }
};

const ItemCard = (props) => {
  const thumbs = thumbnailStore.useContainer();
  const [image, setImage] = useState(thumbs.getPlaceholder());
  useEffect(() => {
    setImage(thumbs.getAssetThumbnail(props.id));
  }, [props.id, thumbs.thumbnails]);
  const isLimited = props.itemRestrictions && props.itemRestrictions.includes("Limited");
  const isLimitedU = props.itemRestrictions && props.itemRestrictions.includes("LimitedUnique");
  const isNew = props.createdAt ? (Date.now() - new Date(props.createdAt).getTime()) < 172800000 : false;
  const href = getItemUrl({ assetId: props.id, name: props.name });
  let priceInner = null;
  if (props.isForSale && props.price === 0) {
    priceInner = <span className="text text-label text-robux-tile"> Free </span>;
  } else if (props.isForSale && props.price !== null) {
    priceInner = <><span className="icon icon-robux"></span><span className="text-robux-tile">{Number(props.price).toLocaleString()}</span></>;
  } else if ((isLimited || isLimitedU) && !props.isForSale) {
    priceInner = <><span className="icon icon-robux"></span><span className="text-robux-tile">{Number(props.lowestPrice || props.price || 0).toLocaleString()}</span></>;
  } else {
    priceInner = <span className="text text-label">Offsale</span>;
  }
  return (
    <li className="list-item item-card">
      <Link href={href}>
        <a className="item-card-container">
          <div className="item-card-link">
            <div className="item-card-thumb-container">
              {isNew ? <span className="status-new">New</span> : null}
              <img
                className="item-card-thumb"
                alt={props.name}
                src={image}
                onError={(e) => {
                  if (e.currentTarget.src !== thumbs.getPlaceholder()) {
                    setImage(thumbs.getPlaceholder());
                  }
                }}
              />
              {isLimitedU ? <span className="icon-limited-unique"></span> : isLimited ? <span className="icon-limited"></span> : null}
            </div>
          </div>
          <div className="item-card-caption">
            <div className="item-card-name-link">
              <div className="item-card-name" title={props.name}>{props.name}</div>
            </div>
            <div className="text-overflow item-card-price font-header-2 text-subheader">{priceInner}</div>
          </div>
        </a>
      </Link>
    </li>
  );
};

const CatalogInner = () => {
  const store = CatalogPageStore.useContainer();
  const input = useRef(null);
  const [catOpen, setCatOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [catLabel, setCatLabel] = useState("Featured");
  useEffect(() => {
    if (input.current) input.current.value = store.query || "";
  }, [store.query]);
  const sortLabel = (SORTS.find((s) => s.key === store.sort) || SORTS[0]).label;
  const applySearch = () => {
    store.setQuery(input.current ? input.current.value : "");
  };
  const pickCategory = (name) => {
    setCatLabel(name);
    setCatOpen(false);
    const mapped = categoryToStore(name);
    store.setCategory(mapped.category);
    store.setSubCategory(mapped.subCategory);
  };
  const pickSort = (key) => {
    setSortOpen(false);
    store.setSort(key);
  };
  const items = store.results && store.results.data ? store.results.data : [];
  return (
    <div className="catalog-container">
      <div id="catalog-container">
        <div className="catalog-content" id="catalog-content">
          <div id="main-view">
            <div className="search-bars">
              <h1 className="heading">
                <a href="/catalog">Catalog</a>
              </h1>
              <a className="btn-growth-md buy-robux" href="/upgrades/robux">Buy Robux</a>
              <div className="clearfix">
                <div className="search-container">
                  <div className="input-group">
                    <input
                      className="form-control input-field search-input"
                      placeholder="Search"
                      maxLength={50}
                      ref={input}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") applySearch();
                      }}
                    />
                    <div className="input-group-btn" style={{ position: "relative" }}>
                      <button
                        type="button"
                        className="input-dropdown-btn category-options"
                        disabled={store.locked}
                        onClick={() => { setCatOpen(!catOpen); setSortOpen(false); }}
                      >
                        <span className="text-overflow rbx-selection-label">{catLabel}</span>
                        <span className="icon-down-16x16"></span>
                      </button>
                      {catOpen ? (
                        <ul className="dropdown-menu" role="menu">
                          {CATEGORIES.map((c) => (
                            <li key={c}>
                              <a onClick={() => pickCategory(c)}>{c}</a>
                            </li>
                          ))}
                        </ul>
                      ) : null}
                      <button className="input-addon-btn" type="submit" onClick={applySearch}>
                        <span className="icon-search"></span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="catalog-results">
              <div className="breadcrumbs">
                <ul className="breadcrumb-container">
                  <li>
                    <a className="text-link breadcrumb-link">{catLabel}</a>
                  </li>
                </ul>
                <div className="sort-menus">
                  <div className="input-group-btn sort-dropdown">
                    <button
                      type="button"
                      className="input-dropdown-btn"
                      disabled={store.locked}
                      onClick={() => { setSortOpen(!sortOpen); setCatOpen(false); }}
                    >
                      <span className="rbx-selection-label">{sortLabel}</span>
                      <span className="icon-down-16x16"></span>
                    </button>
                    {sortOpen ? (
                      <ul className="dropdown-menu" role="menu">
                        {SORTS.map((s) => (
                          <li key={s.key}>
                            <a className="text-overflow" title={s.label} onClick={() => pickSort(s.key)}>{s.label}</a>
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </div>
                </div>
              </div>
              <div id="results" className="results-container">
                {store.results && items.length === 0 ? (
                  <div className="section-content-off">No items found.</div>
                ) : null}
                <ul className={"hlist item-cards-stackable" + (store.locked ? " faded" : "")}>
                  {items.map((v) => (
                    <ItemCard key={v.id} {...v} />
                  ))}
                </ul>
                <ul className="pager">
                  <li className={store.page <= 1 || store.locked ? "disabled" : ""}>
                    <a onClick={() => {
                      if (store.locked || store.page <= 1) return;
                      store.setPage(store.page - 1);
                      store.setCursor(store.previousCursor);
                    }}>Previous</a>
                  </li>
                  <li className={!store.nextCursor || store.locked ? "disabled" : ""}>
                    <a onClick={() => {
                      if (store.locked || !store.nextCursor) return;
                      store.setPage(store.page + 1);
                      store.setCursor(store.nextCursor);
                    }}>Next</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const CatalogPage = () => {
  return (
    <CatalogPageStore.Provider>
      <style>{CATALOG_CSS}</style>
      <CatalogInner />
    </CatalogPageStore.Provider>
  );
};

CatalogPage.getInitialProps = () => {
  return {
    title: "Catalog - ROBLOX",
  };
};

export default CatalogPage;
