import React, { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import CatalogPageStore from "../../stores/catalogPage";
import thumbnailStore from "../../stores/thumbnailStore";
import { getItemUrl } from "../../services/catalog";

const CATALOG_CSS = `
.rbx19{max-width:970px;margin:0 auto;padding:12px 8px 48px;font-family:Source Sans Pro,Arial,Helvetica,sans-serif;color:#191919;min-height:500px;background:#e3e3e3}
.rbx19 *{box-sizing:border-box}
.rbx19 button{appearance:none;-webkit-appearance:none;margin:0;font-family:inherit;line-height:1}
.rbx19-top{display:flex;align-items:center;flex-wrap:wrap;gap:8px;margin-bottom:10px;position:relative;z-index:50}
.rbx19-heading{margin:0;padding:0;font-size:32px;font-weight:800;line-height:38px}
.rbx19-heading a{color:#191919;text-decoration:none}
.rbx19-buy{background:#00b06f;color:#fff!important;border-radius:3px;padding:9px 16px;font-size:16px;font-weight:500;text-decoration:none;white-space:nowrap}
.rbx19-search{flex:1 1 auto;display:flex;justify-content:flex-end}
.rbx19-ig{display:flex;align-items:center;height:38px}
.rbx19-input{width:240px;height:38px;border:1px solid #b8b8b8;border-right:0;border-radius:3px 0 0 3px;padding:0 12px;font-size:16px;background:#fff}
.rbx19-ddwrap{position:relative;height:38px}
.rbx19-ddbtn{display:flex;align-items:center;justify-content:space-between;height:38px;background:#fff;border:1px solid #b8b8b8;color:#191919;padding:0 10px;font-size:16px;width:170px;cursor:pointer}
.rbx19-ddbtn span{overflow:hidden;text-overflow:ellipsis;white-space:nowrap;flex:1;padding-right:8px}
.rbx19-caret{width:0;height:0;border-left:5px solid transparent;border-right:5px solid transparent;border-top:6px solid #191919;flex:0 0 auto}
.rbx19-menu{position:absolute;z-index:400;left:0;top:100%;background:#fff;border:1px solid #b8b8b8;margin:0;padding:4px 0;min-width:100%;box-shadow:0 2px 4px rgba(0,0,0,.15);max-height:320px;overflow:auto}
.rbx19-menu button{display:block;width:100%;text-align:left;padding:8px 12px;background:transparent;border:0;cursor:pointer;font-size:16px}
.rbx19-menu button:hover{background:#00a2ff;color:#fff}
.rbx19-searchbtn{height:38px;width:38px;padding:0;border:1px solid #00a2ff;border-radius:0 3px 3px 0;cursor:pointer;background-color:#00a2ff;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 28 28'%3E%3Ccircle cx='12' cy='12' r='6' fill='none' stroke='%23ffffff' stroke-width='2'/%3E%3Cline x1='16.5' y1='16.5' x2='22' y2='22' stroke='%23ffffff' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");background-repeat:no-repeat;background-position:center;background-size:20px 20px}
.rbx19-body{display:flex;align-items:flex-start}
.rbx19-side{width:160px;flex:0 0 160px;padding-right:12px;border-right:1px solid #b8b8b8}
.rbx19-side h3{margin:0 0 8px;font-size:20px;font-weight:700}
.rbx19-panel{margin:0;padding:0;list-style:none}
.rbx19-catbtn{display:block;width:100%;text-align:left;background:transparent;border:0;padding:6px 0;color:#757575;font-size:16px;cursor:pointer}
.rbx19-catbtn:hover,.rbx19-catbtn.is-on{color:#00a2ff}
.rbx19-plus{float:right}
.rbx19-subs{list-style:none;margin:0;padding:0 0 4px 12px}
.rbx19-subs button{display:block;width:100%;text-align:left;background:transparent;border:0;padding:4px 0;color:#757575;font-size:14px;cursor:pointer}
.rbx19-subs button:hover,.rbx19-subs button.is-on{color:#00a2ff}
.rbx19-filters{border-top:1px solid #b8b8b8;margin-top:8px;padding-top:10px}
.rbx19-filters h4{margin:0 0 6px;font-size:16px;font-weight:700}
.rbx19-filters label{display:block;font-size:13px;margin:3px 0;cursor:pointer}
.rbx19-allg{background:none;border:0;padding:0 0 6px;color:#0055b3;cursor:pointer;font-weight:600;font-size:13px}
.rbx19-main{flex:1;min-width:0;padding-left:8px}
.rbx19-crumbs{display:flex;align-items:center;justify-content:space-between;margin:6px 0 12px;min-height:38px;position:relative;z-index:30}
.rbx19-crumb{color:#00a2ff;font-weight:500;font-size:16px}
.rbx19 .item-cards-stackable{width:100%;margin:0;padding:0;list-style:none;font-size:0}
.rbx19 .item-cards-stackable .item-card{display:inline-block;vertical-align:top;width:150px;padding:5px;font-size:16px}
.rbx19 .item-card-container{display:block;width:150px;max-width:150px;padding:0 0 6px;background:#fff;color:#191919;text-decoration:none;border:1px solid #b8b8b8}
.rbx19 .item-card-link{display:block;width:150px;height:150px}
.rbx19 .item-card-thumb-container{position:relative;width:150px!important;height:150px!important;border-bottom:1px solid #e3e3e3;background:#f2f2f2;overflow:hidden}
.rbx19 .item-card-thumb{width:150px!important;height:150px!important;object-fit:cover;display:block;border:0}
.rbx19 .item-card-caption{padding-top:6px;width:150px}
.rbx19 .item-card-name-link{display:block}
.rbx19 .item-card-name{height:40px;overflow:hidden;font-weight:500;padding:0 5px;font-size:16px;line-height:1.25;color:#191919}
.rbx19 .item-card-price{padding:0 5px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:14px}
.rbx19 .font-header-2{font-size:16px;font-weight:500}
.rbx19 .text-subheader{color:#757575}
.rbx19 .text-robux-tile{color:#02b757!important;font-weight:500}
.rbx19 .item-card-price .icon-robux{display:inline-block;width:16px;height:16px;background-image:url(/img/branded_04182018.svg);background-repeat:no-repeat;background-size:32px auto;background-position:0 -64px;vertical-align:middle;margin:0 4px 2px 0;float:none}
.rbx19 .item-card-thumb-container .icon-limited-label{position:absolute;left:0;bottom:0;width:48px;height:16px;background:url(/img/CatalogOverlays/Limited.png) no-repeat;background-size:contain}
.rbx19 .item-card-thumb-container .icon-limited-unique-label{position:absolute;left:0;bottom:0;width:64px;height:16px;background:url(/img/CatalogOverlays/LimitedUnique.png) no-repeat;background-size:contain}
.rbx19 .status-new{position:absolute;top:6px;right:6px;background:#f68802;color:#fff;font-size:10px;padding:4px;border-radius:3px}
.rbx19-empty{text-align:center;padding:24px;color:#757575}
.rbx19 .rbx-pager{text-align:center}
.rbx19 .pager{padding-left:0;margin:20px 0;list-style:none;text-align:center;display:inline-block}
.rbx19 .pager:after,.rbx19 .pager:before{content:" ";display:table}
.rbx19 .pager:after{clear:both}
.rbx19 .pager li{float:left}
.rbx19 .pager li a{margin:0 9px 0 0;height:32px;width:32px;color:#191919;text-align:center;padding:3px 0 0}
.rbx19 .pager li span{border:0;padding:5px 5px 0 0;display:inline-block}
.rbx19 .pager .pager-next,.rbx19 .pager .pager-prev{user-select:none}
.rbx19 .pager .pager-next a,.rbx19 .pager .pager-prev a{margin-left:0;background-color:#fff;border:1px solid #b8b8b8;border-radius:3px;display:inline-block}
.rbx19 .pager .pager-next a:hover,.rbx19 .pager .pager-prev a:hover,.rbx19 .pager .pager-next a:hover span,.rbx19 .pager .pager-prev a:hover span{background-color:#f2f2f2}
.rbx19 .pager .pager-next a span,.rbx19 .pager .pager-prev a span{background-color:#fff;background-image:url(/img/generic_01312019.svg);background-repeat:no-repeat;background-size:40px auto;width:20px;height:20px}
.rbx19 .pager .pager-prev span{background-position:0 -300px}
.rbx19 .pager .pager-next span{background-position:0 -280px}
.rbx19 .pager .disabled>a,.rbx19 .pager .disabled>a:hover{cursor:default;background-color:#f2f2f2;border:1px solid #e3e3e3}
.rbx19 .pager .disabled>a span,.rbx19 .pager .disabled>a:hover span{background-color:#f2f2f2}
.rbx19-dim{opacity:.45}
@media (max-width:767px){
.rbx19{padding:8px 4px 32px}
.rbx19-heading{font-size:24px}
.rbx19-buy{display:none}
.rbx19-search{width:100%;justify-content:stretch}
.rbx19-ig{width:100%}
.rbx19-input{flex:1;width:auto;min-width:0}
.rbx19-side{display:none}
.rbx19-main{padding-left:0}
.rbx19 .item-cards-stackable .item-card{width:50%!important;padding:4px}
.rbx19 .item-card-container,.rbx19 .item-card-link,.rbx19 .item-card-caption{width:100%!important;max-width:100%!important}
.rbx19 .item-card-link{height:auto!important}
.rbx19 .item-card-thumb-container,.rbx19 .item-card-thumb{width:100%!important;height:auto!important;max-width:none!important;aspect-ratio:1/1}
}
`;

const NAV = [
  {
    name: "Featured",
    category: "Featured",
    subCategory: "",
    children: [
      { name: "All Featured Items", category: "Featured", subCategory: "" },
      { name: "Featured Hats", category: "Featured", subCategory: "Accessories" },
      { name: "Featured Gear", category: "Featured", subCategory: "Gear" },
      { name: "Featured Faces", category: "Featured", subCategory: "Faces" },
    ],
  },
  {
    name: "Collectibles",
    category: "Collectibles",
    subCategory: "",
    children: [
      { name: "All Collectibles", category: "Collectibles", subCategory: "" },
      { name: "Collectible Faces", category: "Collectibles", subCategory: "Faces" },
      { name: "Collectible Hats", category: "Collectibles", subCategory: "Accessories" },
      { name: "Collectible Gear", category: "Collectibles", subCategory: "Gear" },
    ],
  },
  {
    name: "All Categories",
    category: "all",
    subCategory: "all",
    children: [],
  },
  {
    name: "Clothing",
    category: "null",
    subCategory: "Clothing",
    children: [
      { name: "All Clothing", category: "null", subCategory: "Clothing" },
      { name: "Hats", category: "null", subCategory: "Accessories" },
      { name: "Shirts", category: "null", subCategory: "Shirt" },
      { name: "T-Shirts", category: "null", subCategory: "TeeShirt" },
      { name: "Pants", category: "null", subCategory: "Pants" },
      { name: "Packages", category: "null", subCategory: "Packages" },
    ],
  },
  {
    name: "Body Parts",
    category: "bodyparts",
    subCategory: "All",
    children: [
      { name: "All Body Parts", category: "bodyparts", subCategory: "All" },
      { name: "Heads", category: "bodyparts", subCategory: "Heads" },
      { name: "Faces", category: "bodyparts", subCategory: "Faces" },
      { name: "Packages", category: "bodyparts", subCategory: "Packages" },
    ],
  },
  {
    name: "Gear",
    category: "gear",
    subCategory: "all",
    children: [
      { name: "All Gear", category: "gear", subCategory: "all" },
      { name: "Melee Weapon", category: "gear", subCategory: "melee" },
      { name: "Ranged Weapon", category: "gear", subCategory: "ranged" },
      { name: "Explosive", category: "gear", subCategory: "explosive" },
      { name: "Power Up", category: "gear", subCategory: "powerup" },
      { name: "Navigation Enhancer", category: "gear", subCategory: "navigation" },
      { name: "Musical Instrument", category: "gear", subCategory: "musical" },
      { name: "Social Item", category: "gear", subCategory: "social" },
      { name: "Building Tool", category: "gear", subCategory: "building" },
      { name: "Personal Transport", category: "gear", subCategory: "transport" },
    ],
  },
];

const SORTS = [
  { key: 0, label: "Relevance" },
  { key: 3, label: "Recently Updated" },
  { key: 5, label: "Price (High to Low)" },
  { key: 4, label: "Price (Low to High)" },
];

const SEARCH_CATS = [
  { name: "All Categories", category: "all", subCategory: "all" },
  { name: "Featured", category: "Featured", subCategory: "" },
  { name: "Collectibles", category: "Collectibles", subCategory: "" },
  { name: "Clothing", category: "null", subCategory: "Clothing" },
  { name: "Body Parts", category: "bodyparts", subCategory: "All" },
  { name: "Gear", category: "gear", subCategory: "all" },
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

const BLOCKED_TYPE_NUMS = [1, 3, 4, 5, 6, 7, 9, 10, 13, 21, 22, 24, 34, 38, 39, 40, 61, 62];
const BLOCKED_TYPE_NAMES = ["video", "audio", "place", "model", "plugin", "image", "decal", "mesh", "lua", "animation", "badge", "gamepass"];

const isWearableCatalogItem = (item) => {
  const t = item.assetType;
  const name = String(t == null ? "" : t).toLowerCase();
  if (BLOCKED_TYPE_NAMES.indexOf(name) !== -1) return false;
  if (typeof t === "number" && BLOCKED_TYPE_NUMS.indexOf(t) !== -1) return false;
  const limited = item.itemRestrictions && (item.itemRestrictions.indexOf("Limited") !== -1 || item.itemRestrictions.indexOf("LimitedUnique") !== -1);
  if (!item.isForSale && !limited) return false;
  return true;
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
    price = <span className="text-robux-tile">Free</span>;
  } else if (props.isForSale && props.price !== null) {
    price = <><span className="icon icon-robux"></span><span className="text-robux-tile">{Number(props.price).toLocaleString()}</span></>;
  } else if ((isLimited || isLimitedU) && !props.isForSale) {
    price = <><span className="icon icon-robux"></span><span className="text-robux-tile">{Number(props.lowestPrice || props.price || 0).toLocaleString()}</span></>;
  } else {
    price = <span>Offsale</span>;
  }
  return (
    <li className="list-item item-card">
      <NextLink href={href}>
        <a className="item-card-container">
          <div className="item-card-link">
            <div className="item-card-thumb-container">
              {isNew ? <span className="status-new">New</span> : null}
              <img
                className="item-card-thumb"
                width={126}
                height={126}
                alt={props.name}
                src={image}
                onError={(e) => {
                  if (e.currentTarget.src !== thumbs.getPlaceholder()) {
                    setImage(thumbs.getPlaceholder());
                  }
                }}
              />
              {isLimitedU ? <span className="icon-limited-unique-label"></span> : isLimited ? <span className="icon-limited-label"></span> : null}
            </div>
          </div>
          <div className="item-card-caption">
            <div className="item-card-name-link">
              <div className="item-card-name" title={props.name}>{props.name}</div>
            </div>
            <div className="text-overflow item-card-price font-header-2 text-subheader">{price}</div>
          </div>
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
    if (input.current) input.current.value = store.query || "";
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
  const items = store.results && store.results.data ? store.results.data.filter(isWearableCatalogItem) : [];
  const applySearch = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    store.setQuery(input.current ? input.current.value : "");
  };
  const pageClick = (increment) => {
    return (e) => {
      e.preventDefault();
      if (store.locked) return;
      if (increment === 1) {
        const next = store.nextCursor || (items.length >= store.limit ? String(store.page * store.limit) : null);
        if (!next) return;
        store.setPage(store.page + 1);
        store.setCursor(next);
        return;
      }
      if (store.page <= 1) return;
      store.setPage(store.page - 1);
      store.setCursor(store.previousCursor || String(Math.max(0, (store.page - 2) * store.limit)));
    };
  };
  return (
    <div className="rbx19" ref={root}>
      <div className="rbx19-top">
        <h1 className="rbx19-heading">
          <a href="/catalog" onClick={(e) => { e.preventDefault(); applyNav(store, "Featured", ""); setOpenPanel("Featured"); setCatLabel("Featured"); }}>Catalog</a>
        </h1>
        <div className="rbx19-search">
          <div className="rbx19-ig">
            <input className="rbx19-input" placeholder="Search" maxLength={50} ref={input} onKeyDown={(e) => { if (e.key === "Enter") applySearch(e); }} />
            <div className="rbx19-ddwrap">
              <button type="button" className="rbx19-ddbtn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatOpen(!catOpen); setSortOpen(false); }}>
                <span>{catLabel}</span>
                <i className="rbx19-caret"></i>
              </button>
              {catOpen ? (
                <div className="rbx19-menu">
                  {SEARCH_CATS.map((c) => (
                    <button type="button" key={c.name} onClick={(e) => { e.preventDefault(); setCatOpen(false); setCatLabel(c.name); applyNav(store, c.category, c.subCategory); setOpenPanel(c.name === "All Categories" ? "" : c.name); }}>{c.name}</button>
                  ))}
                </div>
              ) : null}
            </div>
            <button type="button" className="rbx19-searchbtn" onClick={applySearch} aria-label="Search"></button>
          </div>
        </div>
        <a className="rbx19-buy" href="/BuildersClub/Upgrade.ashx">Buy Robux</a>
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
                      if (cat.children.length) setOpenPanel(opened ? "" : cat.name);
                      else setOpenPanel(cat.name);
                      applyNav(store, cat.category, cat.subCategory);
                      setCatLabel(cat.name);
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
            <button type="button" className="rbx19-allg" onClick={(e) => { e.preventDefault(); store.setGenres([]); }}>All Genres</button>
            {GENRES.map((v) => {
              const id = "rbx19_genre_" + v.genre;
              return (
                <label key={id} htmlFor={id}>
                  <input
                    id={id}
                    type="checkbox"
                    checked={store.genres.includes(v.genre)}
                    onChange={(c) => {
                      if (!c.currentTarget.checked) store.setGenres(store.genres.filter((x) => x !== v.genre));
                      else store.setGenres([...store.genres, v.genre]);
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
            <div className="rbx19-ddwrap">
              <button type="button" className="rbx19-ddbtn" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSortOpen((o) => !o); setCatOpen(false); }}>
                <span>{sortLabel}</span>
                <i className="rbx19-caret"></i>
              </button>
              {sortOpen ? (
                <div className="rbx19-menu">
                  {SORTS.map((s) => (
                    <button type="button" key={s.key} onClick={(e) => { e.preventDefault(); setSortOpen(false); store.setSort(s.key); }}>{s.label}</button>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
          <div className={store.locked ? "rbx19-dim" : "rbx19-ready"}>
            {store.results && items.length === 0 ? <div className="rbx19-empty">No items found.</div> : null}
            <ul className="hlist item-cards-stackable">
              {items.map((v) => <ItemCard key={v.id} {...v} />)}
            </ul>
          </div>
          <div className="rbx-pager">
            <ul className="pager">
              <li className={store.page <= 1 || store.locked ? "pager-prev disabled" : "pager-prev"}>
                <a href="#" onClick={pageClick(-1)}><span className="icon-back"></span></a>
              </li>
              <li><span>Page {store.page}</span></li>
              <li className={store.locked || (!store.nextCursor && items.length < store.limit) ? "pager-next disabled" : "pager-next"}>
                <a href="#" onClick={pageClick(1)}><span className="icon-next"></span></a>
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
  return { title: "Catalog - ROBLOX" };
};

export default CatalogPage;
