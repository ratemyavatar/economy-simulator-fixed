import React, { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import CatalogPageStore from "../../stores/catalogPage";
import thumbnailStore from "../../stores/thumbnailStore";
import { getItemUrl } from "../../services/catalog";

const CATALOG_CSS = `
.rbx19{max-width:970px;margin:0 auto;padding:12px 8px 48px;font-family:Source Sans Pro,Arial,Helvetica,sans-serif;color:#191919;min-height:500px}
.rbx19 *{box-sizing:border-box}
.rbx19-top{overflow:hidden;margin-bottom:10px}
.rbx19-heading{float:left;margin:0;padding:0;font-size:32px;font-weight:800;line-height:38px}
.rbx19-heading a{color:#191919;text-decoration:none}
.rbx19-buy{float:right;background:#00b06f;color:#fff!important;border-radius:3px;padding:9px 16px;font-size:16px;font-weight:500;text-decoration:none;line-height:1.2em;margin-left:8px}
.rbx19-buy:hover{background:#00965e;color:#fff!important}
.rbx19-search{float:right;margin:0 10px 9px 0}
.rbx19-ig{display:flex;align-items:stretch}
.rbx19-input{width:300px;height:38px;border:1px solid #b8b8b8;border-right:0;border-radius:3px 0 0 3px;padding:5px 12px;font-size:16px;font-weight:300;color:#191919;background:#fff}
.rbx19-input:focus{border-color:#00a2ff;outline:none}
.rbx19-ddwrap{position:relative}
.rbx19-ddbtn{height:38px;background:#fff;border:1px solid #b8b8b8;color:#191919;padding:0 10px;font-size:16px;min-width:160px;width:200px;text-align:left;cursor:pointer}
.rbx19-ddbtn:disabled{opacity:.5;cursor:not-allowed}
.rbx19-ddbtn span{display:inline-block;max-width:150px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:middle}
.rbx19-caret{float:right;margin-top:16px;width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid #191919}
.rbx19-menu{display:block;position:absolute;z-index:40;left:0;top:38px;background:#fff;border:1px solid #b8b8b8;margin:0;padding:4px 0;list-style:none;min-width:100%;box-shadow:0 2px 4px rgba(0,0,0,.15);max-height:338px;overflow:auto}
.rbx19-menu button{display:block;width:100%;text-align:left;padding:8px 12px;color:#191919;background:transparent;border:0;cursor:pointer;font-size:16px}
.rbx19-menu button:hover{background:#00a2ff;color:#fff}
.rbx19-searchbtn{height:38px;width:38px;background:#00a2ff;border:1px solid #00a2ff;color:#fff;cursor:pointer}
.rbx19-searchbtn:disabled{opacity:.5;cursor:not-allowed}
.rbx19-searchicon{display:inline-block;width:14px;height:14px;border:2px solid #fff;border-radius:50%;position:relative}
.rbx19-searchicon:after{content:"";position:absolute;width:6px;height:2px;background:#fff;right:-5px;bottom:-1px;transform:rotate(45deg)}
.rbx19-body{display:flex;align-items:flex-start;clear:both}
.rbx19-side{width:160px;flex:0 0 160px;padding-right:12px;border-right:1px solid #b8b8b8}
.rbx19-side h3{margin:0 0 8px;font-size:20px;font-weight:700}
.rbx19-panel{margin:0 0 6px;list-style:none;padding:0}
.rbx19-catbtn{display:block;width:100%;text-align:left;background:transparent;border:0;padding:6px 0;color:#757575;font-size:16px;font-weight:500;cursor:pointer}
.rbx19-catbtn:hover,.rbx19-catbtn.is-on{color:#00a2ff}
.rbx19-plus{float:right;font-size:18px;line-height:16px;color:#757575;width:16px;text-align:center}
.rbx19-subs{list-style:none;margin:0;padding:0 0 4px 12px}
.rbx19-subs button{display:block;width:100%;text-align:left;background:transparent;border:0;padding:4px 0;color:#757575;font-size:14px;cursor:pointer}
.rbx19-subs button:hover,.rbx19-subs button.is-on{color:#00a2ff}
.rbx19-filters{border-top:1px solid #b8b8b8;margin-top:8px;padding-top:10px}
.rbx19-filters h4{margin:0 0 6px;font-size:16px;font-weight:700}
.rbx19-filters label{display:block;font-size:13px;font-weight:400;margin:3px 0;cursor:pointer;color:#191919}
.rbx19-filters input{margin-right:6px}
.rbx19-allg{background:none;border:0;padding:0 0 6px;color:#0055b3;cursor:pointer;font-weight:600;font-size:13px}
.rbx19-main{flex:1;min-width:0;padding-left:8px}
.rbx19-crumbs{overflow:hidden;margin:6px 0 12px;padding-left:6px}
.rbx19-crumb{float:left;color:#00a2ff;font-weight:500;font-size:16px}
.rbx19-sorts{float:right;position:relative}
.rbx19-cards{list-style:none;margin:0 -5px;padding:0;overflow:hidden}
.rbx19-card{float:left;width:20%;padding:5px}
.rbx19-card a{display:block;position:relative;background:#fff;max-width:150px;margin:0 auto;padding:0 0 5px;color:#191919;text-decoration:none}
.rbx19-thumb{position:relative;width:100%;padding-bottom:100%;background:#e3e3e3;overflow:hidden}
.rbx19-thumb img{position:absolute;top:0;left:0;width:100%;height:100%;object-fit:cover;border:0}
.rbx19-name{margin-top:6px;font-size:16px;line-height:1.2em;max-height:2.4em;overflow:hidden}
.rbx19-price{margin-top:3px;font-size:14px;font-weight:500;color:#02b757}
.rbx19-robux{display:inline-block;width:16px;height:16px;background:url(/img/img-robux.png) no-repeat center;background-size:contain;vertical-align:middle;margin-right:3px}
.rbx19-lim{position:absolute;left:0;bottom:0;width:48px;height:16px;background:url(/img/CatalogOverlays/Limited.png) no-repeat;background-size:contain}
.rbx19-limu{position:absolute;left:0;bottom:0;width:64px;height:16px;background:url(/img/CatalogOverlays/LimitedUnique.png) no-repeat;background-size:contain}
.rbx19-new{position:absolute;top:6px;right:6px;background:#f68802;color:#fff;font-size:12px;padding:4px;border-radius:3px;z-index:1}
.rbx19-empty{text-align:center;padding:24px;color:#757575}
.rbx19-pager{text-align:center;margin:20px 0 0;padding:0;list-style:none}
.rbx19-pager li{display:inline-block;margin:0 4px}
.rbx19-pager button{min-width:32px;height:32px;line-height:30px;border:1px solid #b8b8b8;border-radius:3px;padding:0 10px;color:#00a2ff;background:#fff;cursor:pointer}
.rbx19-pager button:disabled{color:#b8b8b8;cursor:default}
.rbx19-dim{opacity:.4;pointer-events:none}
@media (max-width:767px){.rbx19-card{width:33.333%}.rbx19-side{display:none}.rbx19-search{display:none}.rbx19-input{width:160px}}
`;

const NAV = [
  {
    name: "View All Items",
    category: "Featured",
    subCategory: "",
    children: [],
  },
  {
    name: "Featured",
    category: "Featured",
    subCategory: "",
    children: [
      { name: "All Featured Items", category: "Featured", subCategory: "" },
      { name: "Featured Accessories", category: "Featured", subCategory: "Accessories" },
      { name: "Featured Animations", category: "Featured", subCategory: "Accessories" },
      { name: "Featured Faces", category: "Featured", subCategory: "Faces" },
      { name: "Featured Gear", category: "Featured", subCategory: "Gear" },
      { name: "Featured Bundles", category: "Featured", subCategory: "Packages" },
      { name: "Featured Emotes", category: "Featured", subCategory: "Accessories" },
    ],
  },
  {
    name: "Community Creations",
    category: "Featured",
    subCategory: "",
    children: [],
  },
  {
    name: "Collectibles",
    category: "Collectibles",
    subCategory: "",
    children: [
      { name: "All Collectibles", category: "Collectibles", subCategory: "" },
      { name: "Collectible Accessories", category: "Collectibles", subCategory: "Accessories" },
      { name: "Collectible Faces", category: "Collectibles", subCategory: "Faces" },
      { name: "Collectible Gear", category: "Collectibles", subCategory: "Gear" },
    ],
  },
  {
    name: "Clothing",
    category: "Clothing",
    subCategory: "",
    children: [
      { name: "All Clothing", category: "Clothing", subCategory: "Clothing" },
      { name: "Shirts", category: "Clothing", subCategory: "Shirt" },
      { name: "T-Shirts", category: "Clothing", subCategory: "TeeShirt" },
      { name: "Pants", category: "Clothing", subCategory: "Pants" },
      { name: "Bundles", category: "Clothing", subCategory: "Packages" },
    ],
  },
  {
    name: "Body Parts",
    category: "bodyparts",
    subCategory: "",
    children: [
      { name: "All Body Parts", category: "bodyparts", subCategory: "All" },
      { name: "Heads", category: "bodyparts", subCategory: "Heads" },
      { name: "Faces", category: "bodyparts", subCategory: "Faces" },
      { name: "Bundles", category: "bodyparts", subCategory: "Packages" },
    ],
  },
  {
    name: "Gear",
    category: "gear",
    subCategory: "",
    children: [
      { name: "All Gear", category: "gear", subCategory: "all" },
      { name: "Building", category: "gear", subCategory: "building" },
      { name: "Explosive", category: "gear", subCategory: "explosive" },
      { name: "Melee", category: "gear", subCategory: "melee" },
      { name: "Musical", category: "gear", subCategory: "musical" },
      { name: "Navigation", category: "gear", subCategory: "navigation" },
      { name: "Power Up", category: "gear", subCategory: "powerup" },
      { name: "Ranged", category: "gear", subCategory: "ranged" },
      { name: "Social", category: "gear", subCategory: "social" },
      { name: "Transport", category: "gear", subCategory: "transport" },
    ],
  },
  {
    name: "Accessories",
    category: "Accessories",
    subCategory: "",
    children: [
      { name: "All Accessories", category: "Accessories", subCategory: "" },
      { name: "Hats", category: "Accessories", subCategory: "Hats" },
      { name: "Hair", category: "Accessories", subCategory: "Hats" },
      { name: "Face", category: "Accessories", subCategory: "Hats" },
      { name: "Neck", category: "Accessories", subCategory: "Hats" },
      { name: "Shoulder", category: "Accessories", subCategory: "Hats" },
      { name: "Front", category: "Accessories", subCategory: "Hats" },
      { name: "Back", category: "Accessories", subCategory: "Hats" },
      { name: "Waist", category: "Accessories", subCategory: "Hats" },
    ],
  },
  {
    name: "Avatar Animations",
    category: "Accessories",
    subCategory: "",
    children: [
      { name: "Emotes", category: "Accessories", subCategory: "" },
    ],
  },
];

const SORTS = [
  { key: 0, label: "Relevance" },
  { key: 100, label: "Most Favorited" },
  { key: 101, label: "Bestselling" },
  { key: 3, label: "Recently Updated" },
  { key: 5, label: "Price (High to Low)" },
  { key: 4, label: "Price (Low to High)" },
];

const SEARCH_CATS = [
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

const GENRES = [
  { genre: 13, name: "Building" },
  { genre: 5, name: "Horror" },
  { genre: 1, name: "Town and City" },
  { genre: 11, name: "Military" },
  { genre: 9, name: "Comedy" },
  { genre: 2, name: "Medieval" },
  { genre: 7, name: "Adventure" },
  { genre: 3, name: "Sci-Fi" },
  { genre: 6, name: "Naval" },
  { genre: 14, name: "FPS" },
  { genre: 15, name: "RPG" },
  { genre: 8, name: "Sports" },
  { genre: 4, name: "Fighting" },
  { genre: 10, name: "Western" },
];

const applyNav = (store, category, subCategory) => {
  store.setCategory(category);
  store.setSubCategory(subCategory || "");
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
  let price = null;
  if (props.isForSale && props.price === 0) {
    price = <span>Free</span>;
  } else if (props.isForSale && props.price !== null) {
    price = <span><span className="rbx19-robux"></span>{Number(props.price).toLocaleString()}</span>;
  } else if ((isLimited || isLimitedU) && !props.isForSale) {
    price = <span><span className="rbx19-robux"></span>{Number(props.lowestPrice || props.price || 0).toLocaleString()}</span>;
  } else {
    price = <span style={{ color: "#757575" }}>Offsale</span>;
  }
  return (
    <li className="rbx19-card">
      <NextLink href={href}>
        <a>
          <div className="rbx19-thumb">
            {isNew ? <span className="rbx19-new">New</span> : null}
            <img
              alt={props.name}
              src={image}
              onError={(e) => {
                if (e.currentTarget.src !== thumbs.getPlaceholder()) {
                  setImage(thumbs.getPlaceholder());
                }
              }}
            />
            {isLimitedU ? <span className="rbx19-limu"></span> : isLimited ? <span className="rbx19-lim"></span> : null}
          </div>
          <div className="rbx19-name" title={props.name}>{props.name}</div>
          <div className="rbx19-price">{price}</div>
        </a>
      </NextLink>
    </li>
  );
};

const CatalogInner = () => {
  const store = CatalogPageStore.useContainer();
  const input = useRef(null);
  const root = useRef(null);
  const [catOpen, setCatOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const [catLabel, setCatLabel] = useState("Featured");
  const [openPanel, setOpenPanel] = useState("Featured");
  useEffect(() => {
    if (input.current) {
      input.current.value = store.query || "";
    }
  }, [store.query]);
  useEffect(() => {
    const onDoc = (e) => {
      if (root.current && !root.current.contains(e.target)) {
        setCatOpen(false);
        setSortOpen(false);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);
  const sortLabel = (SORTS.find((s) => s.key === store.sort) || SORTS[0]).label;
  const applySearch = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    store.setQuery(input.current ? input.current.value : "");
  };
  const pickSearchCat = (name) => {
    setCatLabel(name);
    setCatOpen(false);
    const match = NAV.find((n) => n.name === name) || NAV.find((n) => n.name === "Featured");
    if (name === "All Categories") {
      applyNav(store, "Featured", "");
      setOpenPanel("Featured");
      return;
    }
    applyNav(store, match.category, match.subCategory);
    setOpenPanel(match.name);
  };
  const items = store.results && store.results.data ? store.results.data : [];
  return (
    <div className="rbx19" ref={root}>
      <div className="rbx19-top">
        <h1 className="rbx19-heading">
          <a href="/catalog" onClick={(e) => { e.preventDefault(); applyNav(store, "Featured", ""); setOpenPanel("Featured"); setCatLabel("Featured"); }}>Catalog</a>
        </h1>
        <a className="rbx19-buy" href="/upgrades/robux">Buy Robux</a>
        <div className="rbx19-search">
          <div className="rbx19-ig">
            <input
              className="rbx19-input"
              placeholder="Search"
              maxLength={50}
              ref={input}
              onKeyDown={(e) => {
                if (e.key === "Enter") applySearch(e);
              }}
            />
            <div className="rbx19-ddwrap">
              <button
                type="button"
                className="rbx19-ddbtn"
                disabled={store.locked}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setCatOpen(!catOpen);
                  setSortOpen(false);
                }}
              >
                <span>{catLabel}</span>
                <i className="rbx19-caret"></i>
              </button>
              {catOpen ? (
                <div className="rbx19-menu">
                  {SEARCH_CATS.map((c) => (
                    <button type="button" key={c} onClick={(e) => { e.preventDefault(); e.stopPropagation(); pickSearchCat(c); }}>{c}</button>
                  ))}
                </div>
              ) : null}
            </div>
            <button type="button" className="rbx19-searchbtn" disabled={store.locked} onClick={applySearch}>
              <span className="rbx19-searchicon"></span>
            </button>
          </div>
        </div>
      </div>
      <div className="rbx19-body">
        <div className="rbx19-side">
          <h3>Category</h3>
          <ul className="rbx19-panel">
            {NAV.map((cat) => {
              const opened = openPanel === cat.name && cat.children.length > 0;
              return (
                <li key={cat.name}>
                  <button
                    type="button"
                    className={"rbx19-catbtn" + (openPanel === cat.name ? " is-on" : "")}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (cat.children.length) {
                        setOpenPanel(opened ? "" : cat.name);
                      } else {
                        setOpenPanel(cat.name);
                      }
                      applyNav(store, cat.category, cat.subCategory);
                      setCatLabel(cat.name === "View All Items" ? "All Categories" : cat.name);
                    }}
                  >
                    {cat.children.length ? <span className="rbx19-plus">{opened ? "−" : "+"}</span> : null}
                    {cat.name}
                  </button>
                  {opened ? (
                    <ul className="rbx19-subs">
                      {cat.children.map((sub) => (
                        <li key={sub.name}>
                          <button
                            type="button"
                            className={store.subCategory === sub.subCategory && store.category === sub.category ? "is-on" : ""}
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              applyNav(store, sub.category, sub.subCategory);
                              setCatLabel(cat.name);
                            }}
                          >
                            {sub.name}
                          </button>
                        </li>
                      ))}
                    </ul>
                  ) : null}
                </li>
              );
            })}
          </ul>
          <div className="rbx19-filters">
            <h4>Genre</h4>
            <button
              type="button"
              className="rbx19-allg"
              onClick={(e) => {
                e.preventDefault();
                store.setGenres([]);
              }}
            >
              All Genres
            </button>
            {GENRES.map((v) => {
              const id = "rbx19_genre_" + v.genre;
              return (
                <label key={id} htmlFor={id}>
                  <input
                    id={id}
                    type="checkbox"
                    checked={store.genres.includes(v.genre)}
                    onChange={(c) => {
                      if (c.currentTarget.checked === false) {
                        store.setGenres(store.genres.filter((x) => x !== v.genre));
                      } else {
                        store.setGenres([...store.genres, v.genre]);
                      }
                    }}
                  />
                  {v.name}
                </label>
              );
            })}
          </div>
        </div>
        <div className="rbx19-main">
          <div className="rbx19-crumbs">
            <span className="rbx19-crumb">{catLabel}</span>
            <div className="rbx19-sorts">
              <button
                type="button"
                className="rbx19-ddbtn"
                disabled={store.locked}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSortOpen(!sortOpen);
                  setCatOpen(false);
                }}
              >
                <span>{sortLabel}</span>
                <i className="rbx19-caret"></i>
              </button>
              {sortOpen ? (
                <div className="rbx19-menu">
                  {SORTS.map((s) => (
                    <button
                      type="button"
                      key={s.key}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setSortOpen(false);
                        store.setSort(s.key);
                      }}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <div className={store.locked ? "rbx19-dim" : ""}>
            {store.results && items.length === 0 ? <div className="rbx19-empty">No items found.</div> : null}
            <ul className="rbx19-cards">
              {items.map((v) => (
                <ItemCard key={v.id} {...v} />
              ))}
            </ul>
            <ul className="rbx19-pager">
              <li>
                <button
                  type="button"
                  disabled={store.page <= 1 || store.locked}
                  onClick={(e) => {
                    e.preventDefault();
                    if (store.locked || store.page <= 1) return;
                    store.setPage(store.page - 1);
                    store.setCursor(store.previousCursor);
                  }}
                >
                  Previous
                </button>
              </li>
              <li>
                <button
                  type="button"
                  disabled={!store.nextCursor || store.locked}
                  onClick={(e) => {
                    e.preventDefault();
                    if (store.locked || !store.nextCursor) return;
                    store.setPage(store.page + 1);
                    store.setCursor(store.nextCursor);
                  }}
                >
                  Next
                </button>
              </li>
            </ul>
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
