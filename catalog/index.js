import React, { useEffect, useRef, useState } from "react";
import NextLink from "next/link";
import CatalogPageStore from "../../stores/catalogPage";
import thumbnailStore from "../../stores/thumbnailStore";
import { getItemUrl } from "../../services/catalog";

const CATALOG_CSS = `
.rbx19{--primary-color:#00a2ff;--white-color:#fff;--white-color-hover:#2c2e30;--text-color-primary:#fff;--text-color-secondary:#b8b8b8;--text-color-tertiary:#b8b8b8;--text-color-quinary:#3d3f41;--robux-color:#02b757;--background-color:#232527;max-width:970px;margin:0 auto;padding:12px 8px 48px;font-family:Source Sans Pro,Arial,Helvetica,sans-serif;color:#fff;min-height:100vh;background:#232527}
.rbx19 *{box-sizing:border-box}
.rbx19 a{color:inherit;text-decoration:none}
.rbx19 button{appearance:none;-webkit-appearance:none;margin:0;font-family:inherit}
.rbx19 .flex{display:flex;flex-wrap:wrap}
.rbx19 .flex-column{flex-direction:column}
.rbx19 .w-100{width:100%!important}
.rbx19 .w-fit-content{width:fit-content}
.rbx19 .justify-content-between{justify-content:space-between!important}
.rbx19 .justify-content-end{justify-content:flex-end!important}
.rbx19 .justify-content-center{justify-content:center!important}
.rbx19 .align-items-center{align-items:center!important}
.rbx19 .position-relative{position:relative!important}
.rbx19 .inherit-color,.rbx19 .inherit-color *{color:inherit}
.rbx19 .inherit-font-size{font-size:inherit}
.rbx19 .display-none{display:none}
.rbx19 .text-overflow-2{overflow:hidden;text-overflow:ellipsis;-webkit-box-orient:vertical;-webkit-line-clamp:2;display:-webkit-box!important}
.rbx19 .inputTextStyle{border:1px solid var(--text-color-secondary);color:var(--text-color-primary);font-weight:300;font-size:16px;height:38px;line-height:36px;padding:0 12px;appearance:none;display:block;width:100%;background-color:var(--white-color);border-radius:3px;outline:none;box-sizing:border-box}
.rbx19 .catalogHeader-0-2-225{width:100%}
.rbx19 .catalogHeader-0-2-225 h1{margin:0;font-size:36px;font-weight:800}
.rbx19 .search-0-2-236{align-items:stretch;flex-wrap:nowrap;height:38px}
.rbx19 .searchWrapper-0-2-233{width:300px;display:flex;height:38px}
.rbx19 .inputStyle-0-2-230{color:var(--text-color-primary);width:100%;height:38px;font-weight:500;border-top-right-radius:0;border-bottom-right-radius:0}
.rbx19 .selectorWrapper-0-2-231{width:200px;position:relative;height:38px}
.rbx19 .selector-0-2-232{height:38px;padding:0 12px;border-left:none;border-color:var(--text-color-secondary);border-radius:0;display:flex;align-items:center;box-sizing:border-box}
.rbx19 .selector-0-2-232 *{font-weight:500;line-height:1}
.rbx19 .searchButton-0-2-234{height:38px;width:38px;padding:0;border-left:0;border-top-left-radius:0;border-bottom-left-radius:0;cursor:pointer;display:flex;align-items:center;justify-content:center;box-sizing:border-box}
.rbx19 .newCancelButton-0-2-148{height:38px;display:inline-flex;align-items:center;justify-content:center;padding:0 8px;font-size:18px;background:var(--white-color);text-align:center;font-weight:500;line-height:100%;user-select:none;white-space:nowrap;border-radius:3px;vertical-align:middle;color:var(--text-color-primary)!important;border:1px solid var(--text-color-secondary)!important;box-sizing:border-box}
.rbx19 .icon-default-generic,.rbx19 .icon-search,.rbx19 .icon-menu,.rbx19 .icon-plus,.rbx19 .icon-minus,.rbx19 .icon-close,.rbx19 .icon-back,.rbx19 .icon-next{background-repeat:no-repeat;display:inline-block;vertical-align:middle}
.rbx19 .icon-search,.rbx19 .icon-menu,.rbx19 .icon-close{background-image:url(/img/generic_03112016.svg);background-size:auto;width:28px;height:28px}
.rbx19 .icon-search{background-position:0 -28px}
.rbx19 .icon-menu{background-position:0 -364px}
.rbx19 .icon-close{background-position:0 -588px}
.rbx19 .icon-plus,.rbx19 .icon-minus{background-image:url(/img/generic-2019.svg);width:28px;height:28px;background-size:56px auto;flex-shrink:0}
.rbx19 .icon-plus{background-position:0 -1544px}
.rbx19 .icon-minus{background-position:0 -1582px}
.rbx19 .icon-plus:hover{background-position:-28px -1544px}
.rbx19 .icon-minus:hover{background-position:-28px -1582px}
.rbx19 .selectorClosed-0-2-243{color:#fff;width:100%;border:1px solid #3d3f41;cursor:pointer;padding:10px 15px;font-size:16px;background:#232527;text-align:left;user-select:none;border-radius:4px;box-sizing:border-box;display:flex;align-items:center;justify-content:space-between}
.rbx19 .search-0-2-236 .selectorClosed-0-2-243{height:38px;padding:0 12px;line-height:36px;border-radius:0;display:flex;align-items:center}
.rbx19 .selectorClosed-0-2-243:hover{background:#00a2ff;color:#fff}
.rbx19 .selectorCaret-0-2-245{float:none;flex-shrink:0;margin-left:8px;line-height:1}
.rbx19 .selectorMenuOpen-0-2-246{width:100%;z-index:3;position:absolute;left:0;top:100%;background:#232527;overflow-x:hidden;border-radius:4px;border:1px solid #3d3f41;box-shadow:0 2px 4px rgba(0,0,0,.35)}
.rbx19 .selectOption-0-2-247{cursor:pointer;padding:10px 15px;font-size:16px;user-select:none;margin-bottom:0;width:100%;background:transparent;border:0;text-align:left;color:#fff}
.rbx19 .selectOption-0-2-247:hover{box-shadow:none;background:#00a2ff;color:#fff}
.rbx19 .catalogContainer-0-2-226{align-items:flex-start}
.rbx19 .searchOptionsContainer-0-2-223{width:160px;border-right:1px solid var(--text-color-secondary);margin-right:12px}
.rbx19 .searchResultsContainer-0-2-224{width:calc(100% - 172px)}
.rbx19 .searchOptionWrapper-0-2-265{margin:0 12px 0 0;border-bottom:1px solid rgb(184,184,184)}
.rbx19 .searchOptionHeader-0-2-266{padding:5px 0;font-size:20px;font-weight:700;line-height:1em;margin:0;color:#fff}
.rbx19 .searchOptionHeaderContainer-0-2-267{margin-bottom:4px}
.rbx19 .categoryWrapper-0-2-268{padding-bottom:12px}
.rbx19 .categoryContainer-0-2-269{margin-bottom:6px}
.rbx19 .categoryContainer-0-2-269 a{font-size:12px;font-weight:400}
.rbx19 .subCategoryContainer-0-2-270{padding-left:12px}
.rbx19 .subCategoryWrapper-0-2-271{font-size:16px;line-height:1.4em}
.rbx19 .subCategoryWrapper-0-2-271>a{width:100%;display:inline-flex;align-items:center;justify-content:space-between;cursor:pointer;border:0;background:transparent;padding:0;font:inherit}
.rbx19 .collapse-0-2-272{height:0;overflow:hidden;flex-direction:column}
.rbx19 .collapse-0-2-272.in{height:auto;display:flex}
.rbx19 .link2019-gray{color:var(--text-color-tertiary)!important}
.rbx19 .link2019-gray:hover,.rbx19 .link2019-gray.is-on{color:var(--primary-color)!important}
.rbx19 .searchOptionWrapper-0-2-275{margin:0 12px 0 0;border-bottom:1px solid rgb(184,184,184);padding-bottom:12px}
.rbx19 .filterHeader-0-2-277{margin:0;padding:9px 0 0;font-size:16px;font-weight:500}
.rbx19 .genreCheckbox-0-2-280{font-size:16px;margin-top:2px;font-weight:500;line-height:1.4em}
.rbx19 .genreCheckbox-0-2-280 *{font-size:12px;font-weight:400}
.rbx19 .allGenres-0-2-281{color:var(--text-color-primary);font-size:12px;font-weight:400;line-height:2.4em;background:none;border:0;padding:0;cursor:pointer}
.rbx19 .allGenres-0-2-281:hover{text-decoration:underline!important}
.rbx19 .checkbox2019 input[type=checkbox]{position:absolute;opacity:0;left:-9999px}
.rbx19 .checkbox2019 input[type=checkbox]+label{user-select:none;display:inline-block;width:100%;height:16px;padding-left:20px;vertical-align:middle;cursor:pointer;line-height:16px;position:relative}
.rbx19 .checkbox2019 label::before{content:" ";display:inline-block;width:16px;height:16px;position:absolute;left:0;top:0;background-color:var(--white-color);border:1px solid var(--text-color-secondary);border-radius:3px}
.rbx19 .checkbox2019 input[type=checkbox]:checked+label::before{background-image:url(/img/generic-2019.svg);background-repeat:no-repeat;background-size:28px;background-position:0 -602px;background-color:var(--primary-color);border-color:var(--primary-color)}
.rbx19 .breadcrumbsContainer-0-2-251{margin:6px 0 12px;padding-left:6px}
.rbx19 .selectorWrapper-0-2-252{width:230px;position:relative}
.rbx19 .selector-0-2-253{padding:5px 12px;line-height:18px}
.rbx19 .resultsContainer-0-2-255{gap:9.6px;min-width:60px}
.rbx19 .cardWrapper-0-2-284{width:calc(16.6667% - 8px);display:flex;border-radius:3px;flex-direction:column}
.rbx19 .cardContainer-0-2-285{width:100%;height:100%;display:flex;position:relative;border-radius:3px;flex-direction:column;background-color:var(--white-color);transition:box-shadow 200ms;box-shadow:rgba(25,25,25,.3) 0 1px 4px 0}
.rbx19 .cardContainer-0-2-285:hover{box-shadow:rgba(25,25,25,.75) 0 1px 6px 0}
.rbx19 .cardImage-0-2-286{width:100%;cursor:pointer;position:relative;aspect-ratio:1/1;border-bottom:1px solid rgb(227,227,227);border-top-left-radius:3px;border-top-right-radius:3px;overflow:hidden;background:#f2f2f2}
.rbx19 .cardImage-0-2-286 img{width:100%;height:auto;min-width:85px;min-height:100%;border-top-left-radius:3px;border-top-right-radius:3px;display:block}
.rbx19 .cardItemLink-0-2-287{width:100%;display:inline-block;padding:6px 6px 0;line-height:16px}
.rbx19 .cardItemLink-0-2-287 span{height:auto!important;display:inline-block;padding:0;font-size:14px;max-width:100%;line-height:1.4em}
.rbx19 .cardItemLinkHeight-0-2-288{height:50px}
.rbx19 .restrictionsContainer-0-2-290{left:-2px;bottom:-1px;overflow:hidden;position:absolute}
.rbx19 .icon-limited-label,.rbx19 .icon-limited-unique-label{background-image:url(/img/icon_labels.svg);background-repeat:no-repeat;background-size:auto;height:18px;display:inline-block;vertical-align:middle}
.rbx19 .icon-limited-label{width:60px;background-position:0 -54px}
.rbx19 .icon-limited-unique-label{width:80px;background-position:0 -126px}
.rbx19 .text-0-2-292{padding:0 5px}
.rbx19 .currencyIcon-0-2-293{margin-top:1px;margin-right:2px}
.rbx19 .currencyText-0-2-294{font-weight:500}
.rbx19 .icon-robux-16x16{background-image:url(/img/branded.svg);background-repeat:no-repeat;background-size:200%;width:16px;height:16px;display:inline-block;vertical-align:middle;background-position:0 -64px}
.rbx19 .text-robux{color:var(--robux-color)}
.rbx19 .text-free{color:var(--text-color-tertiary)}
.rbx19 .itemStatusContainer-0-2-296{gap:4px;top:0;right:0;margin:6px;display:flex;position:absolute}
.rbx19 .itemStatusNew-0-2-298{padding:6px 5px;background-color:rgb(255,141,0);color:#fff;font-size:10px;font-weight:500;line-height:1em;border-radius:3px}
.rbx19 .paginationContainer-0-2-256{gap:10px;width:100%;display:flex;margin-top:25px;align-items:center;justify-content:center}
.rbx19 .paginationBtn-0-2-257{display:flex;padding:3px;aspect-ratio:1/1;background:#fff;border:1px solid var(--text-color-secondary);border-radius:3px;cursor:pointer}
.rbx19 .paginationBtn-0-2-257 span{width:24px;height:24px;display:inline-block;vertical-align:middle;background-size:48px;background-image:url(/img/generic_03112016.svg);background-repeat:no-repeat}
.rbx19 .backIcon-0-2-259{background-position:0 -360px!important}
.rbx19 .forwardIcon-0-2-260{background-position:0 -336px!important}
.rbx19 .paginationBtn-0-2-257.disabled{opacity:.45;cursor:default}
.rbx19 .pages-0-2-258{word-spacing:.25em}
.rbx19-dim{opacity:.45}
.rbx19-empty{text-align:center;padding:24px;color:#757575}
@media (max-width:991px){
.rbx19 .cardWrapper-0-2-284{width:calc(20% - 8px)}
}
@media (max-width:767px){
.rbx19 .catalogHeader-0-2-225{gap:10px;margin-bottom:20px;flex-direction:column}
.rbx19 .searchWrapper-0-2-233{width:100%}
.rbx19 .cardWrapper-0-2-284{width:calc(25% - 8px)}
}
@media (max-width:616px){
.rbx19 .cardWrapper-0-2-284{width:calc(33% - 8px)}
}
@media (max-width:576px){
.rbx19 .searchOptionsContainer-0-2-223{display:none}
.rbx19 .searchResultsContainer-0-2-224{width:100%}
.rbx19 .cardWrapper-0-2-284{width:calc(50% - 8px)}
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
  { genre: 1, name: "Town And City" },
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

const CAELUS = "https://www.caelus.lol";

const absUrl = (u) => {
  if (!u) return u;
  if (u.indexOf("http://") === 0 || u.indexOf("https://") === 0) {
    return u.replace("https://www.anemon.lol", CAELUS).replace("http://localhost:5000", CAELUS);
  }
  return CAELUS + (u.charAt(0) === "/" ? u : "/" + u);
};

const assetThumbUrl = (id, n) => {
  return CAELUS + "/thumbs/asset.ashx?assetId=" + id + "&width=420&height=420&format=png&_=" + n;
};

const ItemCard = (props) => {
  const thumbs = thumbnailStore.useContainer();
  const [tick, setTick] = useState(0);
  const [image, setImage] = useState(assetThumbUrl(props.id, 0));
  useEffect(() => {
    const fromStore = thumbs.getAssetThumbnail(props.id);
    if (fromStore && fromStore !== thumbs.getPlaceholder() && fromStore.indexOf("placeholder") === -1) {
      setImage(absUrl(fromStore));
      return;
    }
    setImage(assetThumbUrl(props.id, tick));
  }, [props.id, thumbs.thumbnails, tick]);
  useEffect(() => {
    let n = 0;
    const t = setInterval(() => {
      n += 1;
      if (n > 20) {
        clearInterval(t);
        return;
      }
      setTick((v) => v + 1);
    }, 4000);
    return () => clearInterval(t);
  }, [props.id]);
  const isLimited = props.itemRestrictions && props.itemRestrictions.includes("Limited");
  const isLimitedU = props.itemRestrictions && props.itemRestrictions.includes("LimitedUnique");
  const isNew = props.createdAt ? (Date.now() - new Date(props.createdAt).getTime()) < 172800000 : false;
  const href = getItemUrl({ assetId: props.id, name: props.name });
  let price = null;
  if (props.isForSale && props.price === 0) {
    price = <span className="currencyText-0-2-294 text-free">Free</span>;
  } else if (props.isForSale && props.price !== null) {
    price = <><span className="icon-robux-16x16 currencyIcon-0-2-293"></span><span className="currencyText-0-2-294 text-robux">{Number(props.price).toLocaleString()}</span></>;
  } else if ((isLimited || isLimitedU) && !props.isForSale) {
    price = <><span className="icon-robux-16x16 currencyIcon-0-2-293"></span><span className="currencyText-0-2-294 text-robux">{Number(props.lowestPrice || props.price || 0).toLocaleString()}</span></>;
  } else {
    price = <span className="currencyText-0-2-294 text-free">Offsale</span>;
  }
  return (
    <div className="cardWrapper-0-2-284">
      <NextLink href={href}>
        <a className="cardContainer-0-2-285">
          <div className="cardImage-0-2-286">
            <img
              alt={props.name}
              src={image}
              onError={() => {
                setImage(thumbs.getPlaceholder());
              }}
            />
            <div className="itemStatusContainer-0-2-296">
              {isNew ? <div className="itemStatusNew-0-2-298">New</div> : null}
            </div>
            <div className="restrictionsContainer-0-2-290">
              {isLimitedU ? <span className="icon-limited-unique-label"></span> : isLimited ? <span className="icon-limited-label"></span> : null}
            </div>
          </div>
          <span className="cardItemLink-0-2-287 cardItemLinkHeight-0-2-288">
            <span className="text-overflow-2 noHeight-0-2-307" title={props.name}>{props.name}</span>
          </span>
          <div className="text-0-2-292 flex w-fit-content">
            {price}
          </div>
        </a>
      </NextLink>
    </div>
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
  const start = (store.page - 1) * store.limit + (items.length ? 1 : 0);
  const end = (store.page - 1) * store.limit + items.length;
  return (
    <div className="rbx19" ref={root}>
      <div className="w-100 flex flex-column catalogPage-0-2-227">
        <div className="w-100 flex justify-content-between align-items-center catalogHeader-0-2-225">
          <h1>
            <a href="/catalog" className="inherit-color inherit-font-size" onClick={(e) => { e.preventDefault(); applyNav(store, "Featured", ""); setOpenPanel("Featured"); setCatLabel("Featured"); }}>Catalog</a>
          </h1>
          <div className="flex search-0-2-236">
            <div className="searchWrapper-0-2-233">
              <input placeholder="Search" className="inputTextStyle inputStyle-0-2-230" maxLength={100} type="text" ref={input} onKeyDown={(e) => { if (e.key === "Enter") applySearch(e); }} />
            </div>
            <div className="flex">
              <div className="selectorWrapper-0-2-242 selectorWrapper-0-2-231">
                <div className="selectorClosed-0-2-243 selector-0-2-232" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCatOpen(!catOpen); setSortOpen(false); }}>
                  <span>{catLabel}</span>
                  <span className="selectorCaret-0-2-245">▼</span>
                </div>
                {catOpen ? (
                  <div className="selectorMenuOpen-0-2-246">
                    {SEARCH_CATS.map((c) => (
                      <button type="button" className="selectOption-0-2-247" key={c.name} onClick={(e) => { e.preventDefault(); setCatOpen(false); setCatLabel(c.name); applyNav(store, c.category, c.subCategory); setOpenPanel(c.name === "All Categories" ? "" : c.name); }}>{c.name}</button>
                    ))}
                  </div>
                ) : null}
              </div>
              <button type="submit" className="searchButton-0-2-234 newCancelButton-0-2-148" onClick={applySearch}>
                <div className="flex justify-content-center align-items-center">
                  <span className="icon-search iconSearch-0-2-238"></span>
                </div>
              </button>
            </div>
          </div>
        </div>
        <div className="w-100 flex catalogContainer-0-2-226 position-relative">
          <div className="searchOptionsContainer-0-2-223">
            <div className="categoryWrapper-0-2-268 searchOptionWrapper-0-2-265 flex flex-column">
              <div className="flex searchOptionHeaderContainer-0-2-267">
                <h3 className="searchOptionHeader-0-2-266">Category</h3>
              </div>
              <div>
                {NAV.map((cat) => {
                  const opened = openPanel === cat.name && cat.children.length > 0;
                  return (
                    <div className="categoryContainer-0-2-269 flex flex-column" key={cat.name}>
                      <div className="subCategoryWrapper-0-2-271">
                        <a className={"link2019-gray" + (openPanel === cat.name ? " is-on" : "")} href="/catalog#" onClick={(e) => {
                          e.preventDefault();
                          if (cat.children.length) setOpenPanel(opened ? "" : cat.name);
                          else setOpenPanel(cat.name);
                          applyNav(store, cat.category, cat.subCategory);
                          setCatLabel(cat.name);
                        }}>
                          <span className="inherit-color inherit-font-size">{cat.name}</span>
                          {cat.children.length ? <span className={"inherit-color inherit-font-size " + (opened ? "icon-minus" : "icon-plus")}></span> : null}
                        </a>
                      </div>
                      <div className={"subCategoryContainer-0-2-270 collapse-0-2-272" + (opened ? " in" : "")}>
                        {cat.children.map((sub) => (
                          <div className="subCategoryWrapper-0-2-271" key={sub.name}>
                            <a className={"link2019-gray" + (store.subCategory === sub.subCategory && store.category === sub.category ? " is-on" : "")} href="/catalog#" onClick={(e) => {
                              e.preventDefault();
                              applyNav(store, sub.category, sub.subCategory);
                              setCatLabel(cat.name);
                            }}>{sub.name}</a>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="searchOptionWrapper-0-2-275">
              <h3 className="searchOptionHeader-0-2-266">Filters</h3>
              <h5 className="filterHeader-0-2-277">Genre</h5>
              <a className="allGenres-0-2-281" href="/catalog#" onClick={(e) => { e.preventDefault(); store.setGenres([]); }}>All Genres</a>
              {GENRES.map((v) => {
                const id = "genre-" + v.genre;
                return (
                  <div className="genreCheckbox-0-2-280 checkbox2019" key={id}>
                    <input
                      id={id}
                      type="checkbox"
                      checked={store.genres.includes(v.genre)}
                      onChange={(c) => {
                        if (!c.currentTarget.checked) store.setGenres(store.genres.filter((x) => x !== v.genre));
                        else store.setGenres([...store.genres, v.genre]);
                      }}
                    />
                    <label htmlFor={id}>{v.name}</label>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="searchResultsContainer-0-2-224">
            <div className="resultsWrapper-0-2-250">
              <div className="breadcrumbsContainer-0-2-251 flex flex-column w-100">
                <div style={{ marginBottom: 6, display: "flex", gap: 5 }}>
                  <span>{catLabel}</span>&gt;<span>All</span>
                </div>
                <div style={{ color: "rgb(117, 117, 117)", fontSize: 12, fontWeight: 400 }}>
                  <span style={{ marginTop: 2 }}>{start} - {end}{store.total != null ? " of " + store.total : ""} Results</span>
                </div>
                <div className="w-100 flex justify-content-end">
                  <div className="selectorWrapper-0-2-242 selectorWrapper-0-2-252">
                    <div className="selectorClosed-0-2-243 selector-0-2-253" onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSortOpen((o) => !o); setCatOpen(false); }}>
                      <span>{sortLabel}</span>
                      <span className="selectorCaret-0-2-245">▼</span>
                    </div>
                    {sortOpen ? (
                      <div className="selectorMenuOpen-0-2-246">
                        {SORTS.map((s) => (
                          <button type="button" className="selectOption-0-2-247" key={s.key} onClick={(e) => { e.preventDefault(); setSortOpen(false); store.setSort(s.key); }}>{s.label}</button>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
              <div className={store.locked ? "resultsContainer-0-2-255 flex rbx19-dim" : "resultsContainer-0-2-255 flex"}>
                {store.results && items.length === 0 ? <div className="rbx19-empty">No items found.</div> : null}
                {items.map((v) => <ItemCard key={v.id} {...v} />)}
              </div>
              <div className="paginationContainer-0-2-256">
                <button type="button" className={"paginationBtn-0-2-257" + (store.page <= 1 || store.locked ? " disabled" : "")} onClick={pageClick(-1)}>
                  <span className="backIcon-0-2-259"></span>
                </button>
                <span className="pages-0-2-258">Page {store.page}</span>
                <button type="button" className={"paginationBtn-0-2-257" + (store.locked || (!store.nextCursor && items.length < store.limit) ? " disabled" : "")} onClick={pageClick(1)}>
                  <span className="forwardIcon-0-2-260"></span>
                </button>
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
  return { title: "Catalog - ROBLOX" };
};

export default CatalogPage;
