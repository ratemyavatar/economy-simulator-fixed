import React, { useEffect, useRef, useState } from "react";
import NotFoundPage from "../../pages/404";
import AuthenticationStore from "../../stores/authentication";
import UserProfileStore from "./stores/UserProfileStore";
import PlayerHeadshot from "../playerHeadshot";
import PlayerImage from "../playerImage";
import { getAvatar } from "../../services/avatar";
import { getItemUrl } from "../../services/catalog";
import { getCollections, getCollectibleInventory, getFavorites } from "../../services/inventory";
import { getUserRobloxBadges } from "../../services/accountInformation";
import { getMembershipType, updateStatus } from "../../services/users";
import { acceptFriendRequest, followUser, sendFriendRequest, unfollowUser, unfriendUser } from "../../services/friends";
import { multiGetGroupIcons, multiGetUniverseIcons } from "../../services/thumbnails";
import { getBaseUrl } from "../../lib/request";
import { abbreviateNumber } from "../../lib/numberUtils";
import thumbnailStore from "../../stores/thumbnailStore";

const PROFILE_CSS = `
.rbx18{max-width:970px;margin:0 auto;padding:12px 0 48px;font-family:Source Sans Pro,Arial,Helvetica,sans-serif;color:#191919;background:#e3e3e3}
.rbx18 *{box-sizing:border-box}
.rbx18 a{text-decoration:none}
.rbx18 button{appearance:none;-webkit-appearance:none;font-family:inherit;margin:0}
.rbx18 .section{position:relative;margin:0 0 12px}
.rbx18 .section::before,.rbx18 .section::after,.rbx18 .container-header::before,.rbx18 .container-header::after,.rbx18 .hlist::before,.rbx18 .hlist::after,.rbx18 .section-content::before,.rbx18 .section-content::after{content:" ";display:table}
.rbx18 .section::after,.rbx18 .container-header::after,.rbx18 .hlist::after,.rbx18 .section-content::after{clear:both}
.rbx18 .container-header{margin:3px 0 6px}
.rbx18 .container-header h3{float:left;margin:0;padding:0;font-size:24px;font-weight:700}
.rbx18 .container-header .btn-more{float:right;margin:0}
.rbx18 .section-content{background:#fff;box-shadow:rgba(25,25,25,.3) 0 1px 4px 0;padding:15px;position:relative;margin:0 0 18px}
.rbx18 .hlist{list-style:none;margin:0;padding:0}
.rbx18 .list-item{float:left}
.rbx18 .text-label{color:#b8b8b8;font-weight:400}
.rbx18 .text-lead{font-size:18px;font-weight:400;color:#191919;margin:0}
.rbx18 .text-name,.rbx18 .text-name:link,.rbx18 .text-name:visited{color:#00a2ff;font-weight:400}
.rbx18 .text-name:hover{text-decoration:underline}
.rbx18 .text-error{color:#e2231a}
.rbx18 .text-overflow{overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rbx18 .profile-header-content{width:100%;position:relative;float:left}
.rbx18 .profile-header-top::before,.rbx18 .profile-header-top::after{content:" ";display:table}
.rbx18 .profile-header-top::after{clear:both}
.rbx18 .profile-header .profile-avatar-image{position:relative;margin-right:12px;width:128px;height:128px;float:left}
.rbx18 .avatar-headshot-lg{background:transparent;border:0;width:128px;height:128px;padding:0;position:relative;border-radius:50%;overflow:hidden}
.rbx18 .avatar-card-link,.rbx18 .avatar-card-image{display:block;width:100%;height:100%;border:0;border-radius:50%;object-fit:cover}
.rbx18 .header-caption{width:calc(100% - 156px);height:128px;position:relative;float:left}
.rbx18 .header-title{display:inline-block}
.rbx18 .header-title::before,.rbx18 .header-title::after{content:" ";display:table}
.rbx18 .header-title::after{clear:both}
.rbx18 .header-title h2,.rbx18 .header-title span[class^=icon]{float:left}
.rbx18 .header-title h2{display:inline-block;margin:0 12px 0 0;font-size:30px;font-weight:400}
.rbx18 .header-title span[class^=icon]{margin:3px 0 0 3px}
.rbx18 .icon-bc,.rbx18 .icon-tbc,.rbx18 .icon-obc{background-image:url(/img/bc_06282017.svg);background-repeat:no-repeat;background-size:auto;width:52px;height:28px;display:inline-block;vertical-align:middle}
.rbx18 .icon-bc{background-position:0 0}
.rbx18 .icon-tbc{background-position:0 -28px}
.rbx18 .icon-obc{background-position:0 -56px}
.rbx18 .header-userstatus{overflow:hidden}
.rbx18 .header-userstatus-text span{width:100%;display:inline-block}
.rbx18 .userstatus-editable{cursor:pointer}
.rbx18 .header-details{position:absolute;right:0;bottom:0;width:100%}
.rbx18 .header-details::before,.rbx18 .header-details::after{content:" ";display:table}
.rbx18 .header-details::after{clear:both}
.rbx18 .details-info{float:left;width:50%;height:54px;list-style:none;margin:0;padding:0}
.rbx18 .details-info li{float:left;width:25%;padding:0 5px;text-align:center}
.rbx18 .details-info .text-label{font-size:16px}
.rbx18 .details-info h3{margin:0;font-size:20px;font-weight:300}
.rbx18 .details-actions{float:right;width:48%;margin-top:6px;list-style:none;padding:0}
.rbx18 .details-actions.desktop-action{display:block}
.rbx18 .details-actions.mobile-action{display:none}
.rbx18 .details-actions li{float:right;padding:0 5px}
.rbx18 .btn-control-md{user-select:none;border:1px solid #b8b8b8;background:#fff;color:#191919;cursor:pointer;display:inline-block;font-weight:400;padding:9px;font-size:18px;line-height:100%;border-radius:3px;min-width:90px}
.rbx18 .btn-control-md.disabled,.rbx18 .btn-control-md:disabled{opacity:.5;cursor:default}
.rbx18 .profile-header-more{position:absolute;top:0;right:6px}
.rbx18 .icon-more{background-image:url(/img/generic_09152017.svg);background-repeat:no-repeat;background-position:0 -616px;width:28px;height:28px;display:inline-block;cursor:pointer}
.rbx18 .icon-more:hover{background-position:-28px -616px}
.rbx18 .rbx-popover-content{position:absolute;right:0;top:28px;z-index:20;background:#fff;border:1px solid #b8b8b8;box-shadow:0 1px 4px rgba(0,0,0,.2);min-width:160px}
.rbx18 .dropdown-menu{list-style:none;margin:0;padding:4px 0}
.rbx18 .dropdown-menu a,.rbx18 .dropdown-menu button{display:block;width:100%;text-align:left;padding:8px 12px;background:0;border:0;color:#191919;cursor:pointer;font-size:16px}
.rbx18 .dropdown-menu a:hover,.rbx18 .dropdown-menu button:hover{background:#00a2ff;color:#fff}
.rbx18 .rbx-tabs-horizontal .nav-tabs{background:#fff;box-shadow:rgba(150,150,150,.74) 0 1px 3px;text-align:center;width:100%;list-style:none;margin:0 0 18px;padding:0;border:0}
.rbx18 .rbx-tab{width:50%;float:left;color:#191919;padding:0;position:relative}
.rbx18 .rbx-tab .rbx-tab-heading{display:block;transition:all .2s ease-in-out;padding:12px 2%;background:#fff;border:0;line-height:100%;color:#191919;cursor:pointer}
.rbx18 .rbx-tab.active .rbx-tab-heading{box-shadow:#00a2ff 0 -4px 0 0 inset}
.rbx18 .text-lead{display:inline-block}
.rbx18 .profile-about-content{padding-bottom:5px;position:relative}
.rbx18 .profile-about-text{position:relative;margin:0;white-space:pre-wrap;font-family:inherit;font-size:16px}
.rbx18 .profile-about-footer{margin-top:8px}
.rbx18 .profile-avatar-left{background:#fff;padding:0 12px;position:relative;float:left;width:50%}
.rbx18 .profile-avatar-left .thumbnail-holder{margin:0 auto;width:300px;height:300px}
.rbx18 .profile-avatar-left .thumbnail-span{display:inline-block;width:300px;height:300px}
.rbx18 .profile-avatar-left .thumbnail-span img{width:100%;height:100%;max-height:300px;object-fit:contain}
.rbx18 .profile-avatar-right{height:300px;float:left;width:50%;position:relative}
.rbx18 .profile-avatar-mask{background:rgba(117,117,117,.5);position:absolute;width:100%;padding:20px 22px;top:0;left:0;height:100%}
.rbx18 .profile-accoutrements-slider{margin:12px 0 6px;height:220px;overflow:hidden}
.rbx18 .accoutrement-item{float:left;padding:5px;text-align:center;width:25%;position:relative}
.rbx18 .accoutrement-image{border-radius:3px;width:100%;height:auto;min-width:85px;background:#fff}
.rbx18 .profile-accoutrements-page-container{text-align:center}
.rbx18 .profile-accoutrements-page{display:inline-block;width:10px;height:10px;border-radius:50%;background:#fff;margin:0 4px;cursor:pointer;opacity:.55}
.rbx18 .profile-accoutrements-page.page-active{opacity:1;background:#00a2ff}
.rbx18 .asset-item{padding:5px 0;text-align:center;width:16.6667%}
.rbx18 .asset-item img{width:140px;height:140px;max-width:100%;object-fit:cover}
.rbx18 .asset-item .item-name{display:block;margin-top:4px;color:#191919}
.rbx18 .friend-list{max-height:120px;overflow:hidden}
.rbx18 .friend-list .friend{width:11.1111%;height:120px;position:relative}
.rbx18 .friend-list .friend .avatar-container{margin:3px auto;width:84px;height:84px}
.rbx18 .friend-list .friend .friend-link{display:block;position:relative;margin:0 auto}
.rbx18 .friend-list .friend .friend-name{display:block;margin:3px 0 0;text-align:center;color:#191919}
.rbx18 .friend-list .friend .friend-name:hover{color:#00a2ff}
.rbx18 .avatar-card-fullbody{width:84px;height:84px;border-radius:50%;overflow:hidden;display:block;margin:0 auto;background:#fff}
.rbx18 .avatar-card-fullbody img{width:100%;height:100%;object-fit:cover;border-radius:50%}
.rbx18 .icon-default-badges,.rbx18 .icon-inviter,.rbx18 .icon-friendship,.rbx18 .icon-welcome-to-the-club,.rbx18 .icon-ambassador,.rbx18 .icon-combat-initiation,.rbx18 .icon-warrior,.rbx18 .icon-bloxxer,.rbx18 .icon-homestead,.rbx18 .icon-bricksmith,.rbx18 .icon-official-model-maker,.rbx18 .icon-builders-club,.rbx18 .icon-turbo-builders-club,.rbx18 .icon-outrageous-builders-club,.rbx18 .icon-administrator,.rbx18 .icon-veteran{background-image:url(/img/badges_06282017.svg);background-repeat:no-repeat;background-size:280px;width:140px;height:140px;display:inline-block;vertical-align:middle}
.rbx18 .icon-inviter{background-position:0 0}
.rbx18 .icon-friendship{background-position:-140px 0}
.rbx18 .icon-welcome-to-the-club{background-position:0 -140px}
.rbx18 .icon-ambassador{background-position:-140px -140px}
.rbx18 .icon-combat-initiation{background-position:0 -280px}
.rbx18 .icon-warrior{background-position:-140px -280px}
.rbx18 .icon-bloxxer{background-position:0 -420px}
.rbx18 .icon-homestead{background-position:-140px -420px}
.rbx18 .icon-bricksmith{background-position:0 -560px}
.rbx18 .icon-official-model-maker{background-position:-140px -560px}
.rbx18 .icon-builders-club{background-position:0 -700px}
.rbx18 .icon-turbo-builders-club{background-position:-140px -700px}
.rbx18 .icon-outrageous-builders-club{background-position:0 -840px}
.rbx18 .icon-administrator{background-position:-140px -840px}
.rbx18 .icon-veteran{background-position:0 -980px}
.rbx18 .badge-list{overflow:hidden;max-height:170px}
.rbx18 .badge-list-more{overflow:auto;max-height:100%}
.rbx18 .badge-item{width:16.6667%;text-align:center;padding:5px 0}
.rbx18 .badge-link{color:#191919}
.rbx18 .profile-stats-container{list-style:none;margin:0;padding:0}
.rbx18 .profile-stat{width:33.3333%;float:left;text-align:center}
.rbx18 .profile-stat .text-label{white-space:nowrap;margin:0}
.rbx18 .profile-stat .text-lead{margin:5px 0 0}
.rbx18 .btn-secondary-xs{user-select:none;border:1px solid #00a2ff;background:#00a2ff;color:#fff;cursor:pointer;display:inline-block;font-weight:400;padding:4px;font-size:14px;line-height:100%;border-radius:3px}
.rbx18 .btn-control-xs{user-select:none;border:1px solid #b8b8b8;background:#fff;color:#191919;cursor:pointer;display:inline-block;font-weight:400;padding:4px;font-size:14px;line-height:100%;border-radius:3px}
.rbx18 .container-buttons{float:right}
.rbx18 .profile-view-selector{margin-left:4px}
.rbx18 .container-buttons .icon-grid,.rbx18 .container-buttons .icon-slideshow{background-image:url(/img/generic_09152017.svg);background-repeat:no-repeat;background-size:40px;width:20px;height:20px;display:inline-block;vertical-align:middle}
.rbx18 .container-buttons .icon-grid{background-position:0 -740px}
.rbx18 .container-buttons .icon-grid.selected{background-position:-20px -740px}
.rbx18 .container-buttons .icon-slideshow{background-position:0 -760px}
.rbx18 .container-buttons .icon-slideshow.selected{background-position:-20px -760px}
.rbx18 .slide-item-container-left{float:left;width:50%;height:260px;background:#0074bd;text-align:center;padding:20px}
.rbx18 .slide-item-container-right{float:left;width:50%;padding:15px 20px;min-height:260px}
.rbx18 .slide-item-image{border-radius:12px;box-shadow:rgba(0,0,0,.49) 0 0 6px 0;height:auto;width:180px;max-width:100%}
.rbx18 .slide-item-name{font-size:24px;font-weight:400;margin:0 0 8px;border-bottom:1px solid #c3c3c3;padding-bottom:6px}
.rbx18 .slide-item-description{height:110px;overflow:hidden;margin:0 0 12px;font-weight:300}
.rbx18 .slide-item-stat-title{color:#b8b8b8;margin:0}
.rbx18 .game-card{float:none;width:161px;height:223px;padding:0 11px 0 0;display:inline-block;margin-bottom:12px;vertical-align:top}
.rbx18 .game-card-container{background:#fff;position:relative;box-shadow:rgba(25,25,25,.3) 0 1px 4px 0;border-radius:3px;height:100%;padding:0 0 6px}
.rbx18 .game-card-thumb-container{border-radius:3px 3px 0 0;position:relative;height:150px;width:150px;overflow:hidden}
.rbx18 .game-card-thumb{width:150px;height:150px;object-fit:cover}
.rbx18 .game-card-name{margin:6px 6px 0;display:block;color:#191919}
.rbx18 .header-userstatus .input-field{padding:2px 12px;height:24px;border:1px solid #b8b8b8;border-radius:3px;width:calc(100% - 80px)}
.rbx18 .header-userstatus-share-button{margin-left:6px}
.rbx18 .tab-pane{display:none}
.rbx18 .tab-pane.active{display:block}
.rbx18 .tab-pane::before,.rbx18 .tab-pane::after{content:" ";display:table}
.rbx18 .tab-pane::after{clear:both}
@media (max-width:767px){
.rbx18 .profile-header .profile-avatar-image{float:none;margin:0 auto}
.rbx18 .header-caption{float:none;height:auto;min-height:140px;width:100%}
.rbx18 .header-details{position:relative}
.rbx18 .details-info{width:100%;float:none}
.rbx18 .details-actions{float:none;width:100%}
.rbx18 .details-actions.desktop-action{display:none}
.rbx18 .details-actions.mobile-action{display:block}
.rbx18 .details-actions.mobile-action li{float:left;width:50%}
.rbx18 .profile-avatar-left,.rbx18 .profile-avatar-right{width:100%;height:auto}
.rbx18 .profile-avatar-right{margin-top:0}
.rbx18 .friend-list .friend{width:25%;float:left}
.rbx18 .asset-item,.rbx18 .badge-item{width:33.3333%}
.rbx18 .profile-stat{width:100%;margin:0 0 12px}
}
`;

const badgeClass = (name) => {
  return "icon-" + String(name || "").toLowerCase().replace(/ /g, "-");
};

const formatDate = (value) => {
  if (!value) return "—";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "—";
  return (d.getMonth() + 1) + "/" + d.getDate() + "/" + d.getFullYear();
};

const AssetThumb = (props) => {
  const thumbs = thumbnailStore.useContainer();
  const [src, setSrc] = useState(thumbs.getPlaceholder());
  useEffect(() => {
    setSrc(thumbs.getAssetThumbnail(props.id));
  }, [props.id, thumbs.thumbnails]);
  return <img className={props.className} alt={props.alt || ""} src={src} />;
};

const UserProfile = (props) => {
  const store = UserProfileStore.useContainer();
  const auth = AuthenticationStore.useContainer();
  const statusInput = useRef(null);
  const [tab, setTab] = useState("about");
  const [moreOpen, setMoreOpen] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const [bcLevel, setBcLevel] = useState(0);
  const [wear, setWear] = useState([]);
  const [wearPage, setWearPage] = useState(0);
  const [collections, setCollections] = useState([]);
  const [badges, setBadges] = useState([]);
  const [showAllBadges, setShowAllBadges] = useState(false);
  const [favorites, setFavorites] = useState([]);
  const [favIcons, setFavIcons] = useState({});
  const [groupIcons, setGroupIcons] = useState({});
  const [gameIcons, setGameIcons] = useState({});
  const [groupMode, setGroupMode] = useState("slide");
  const [groupIdx, setGroupIdx] = useState(0);
  const [rap, setRap] = useState(null);
  useEffect(() => {
    store.setUserId(props.userId);
  }, [props.userId]);
  useEffect(() => {
    if (auth.isPending || !auth.userId || !store.userId) return;
    store.getFriendStatus(auth.userId);
  }, [store.userId, auth.userId, auth.isPending]);
  useEffect(() => {
    if (!store.userId) return;
    setWear([]);
    setWearPage(0);
    setCollections([]);
    setBadges([]);
    setFavorites([]);
    setRap(null);
    setEditStatus(false);
    setMoreOpen(false);
    getAvatar({ userId: store.userId }).then((d) => setWear(d.assets || []));
    getCollections({ userId: store.userId }).then((d) => setCollections(d || [])).catch(() => setCollections([]));
    getUserRobloxBadges({ userId: store.userId }).then(setBadges).catch(() => setBadges([]));
    getMembershipType({ userId: store.userId }).then(setBcLevel).catch(() => setBcLevel(0));
    getFavorites({ userId: store.userId, limit: 6, assetTypeId: 9 }).then((data) => {
      const items = data && data.Data && data.Data.Items ? data.Data.Items : [];
      setFavorites(items);
      const ids = items.map((v) => v.Item && v.Item.UniverseId).filter(Boolean);
      if (ids.length) {
        multiGetUniverseIcons({ universeIds: ids }).then((res) => {
          const obj = {};
          res.forEach((v) => { obj[v.targetId] = v.imageUrl; });
          setFavIcons(obj);
        });
      }
    }).catch(() => setFavorites([]));
    const loadRap = async () => {
      let cursor = "";
      let total = 0;
      for (let i = 0; i < 8; i++) {
        const page = await getCollectibleInventory({ userId: store.userId, cursor, limit: 100 });
        const rows = page && page.data ? page.data : [];
        rows.forEach((row) => {
          total += Number(row.recentAveragePrice || 0);
        });
        if (!page || !page.nextPageCursor) break;
        cursor = page.nextPageCursor;
      }
      setRap(total);
    };
    loadRap().catch(() => setRap(0));
  }, [store.userId]);
  useEffect(() => {
    if (!store.groups || !store.groups.length) return;
    multiGetGroupIcons({ groupIds: store.groups.map((v) => v.group.id) }).then((icons) => {
      const obj = {};
      icons.forEach((item) => { obj[item.targetId] = item.imageUrl; });
      setGroupIcons(obj);
    });
  }, [store.groups]);
  useEffect(() => {
    if (!store.createdGames || !store.createdGames.length) return;
    multiGetUniverseIcons({ universeIds: store.createdGames.map((v) => v.id), size: "150x150" }).then((data) => {
      const obj = {};
      data.forEach((v) => { obj[v.targetId] = v.imageUrl; });
      setGameIcons(obj);
    });
  }, [store.createdGames]);
  if (!store.userId || !store.userInfo || auth.isPending) return null;
  if (store.userInfo.isBanned) return <NotFoundPage />;
  const isOwn = auth.userId == store.userId;
  const isFriend = store.friends && store.friends.find((v) => v.id === auth.userId);
  const requestSent = store.friendStatus === "RequestSent";
  const requestGot = store.friendStatus === "RequestReceived";
  const friendLabel = isFriend ? "Unfriend" : requestGot ? "Accept" : requestSent ? "Pending" : "Add Friend";
  const friendDisabled = isOwn || (!auth.userId) || (requestSent && !isFriend && !requestGot);
  const wearPages = Math.max(1, Math.ceil(wear.length / 8));
  const wearSlice = wear.slice(wearPage * 8, wearPage * 8 + 8);
  const friends = store.friends || [];
  const groups = store.groups || [];
  const group = groups[groupIdx];
  const games = store.createdGames || [];
  const statusText = store.status && store.status.status ? store.status.status : "";
  const onFriend = (e) => {
    e.preventDefault();
    if (friendDisabled) return;
    if (requestGot) {
      acceptFriendRequest({ userId: store.userId }).then(() => {
        store.setFriends([...(store.friends || []), { id: auth.userId, name: auth.username }]);
        store.setFriendStatus("Friends");
      });
    } else if (isFriend) {
      unfriendUser({ userId: store.userId }).then(() => {
        store.setFriends((store.friends || []).filter((v) => v.id !== auth.userId));
        store.setFriendStatus("NotFriends");
      });
    } else {
      sendFriendRequest({ userId: store.userId }).then(() => store.setFriendStatus("RequestSent"));
    }
  };
  const onFollow = (e) => {
    e.preventDefault();
    if (store.isFollowing) {
      store.setIsFollowing(false);
      store.setFollowersCount((store.followersCount || 1) - 1);
      unfollowUser({ userId: store.userId });
    } else {
      store.setIsFollowing(true);
      store.setFollowersCount((store.followersCount || 0) + 1);
      followUser({ userId: store.userId });
    }
    setMoreOpen(false);
  };
  let bc = null;
  if (bcLevel === 1 || bcLevel === 4) bc = <span className="icon-bc"></span>;
  else if (bcLevel === 2) bc = <span className="icon-tbc"></span>;
  else if (bcLevel === 3) bc = <span className="icon-obc"></span>;
  return (
    <div className="rbx18 profile-container">
      <style>{PROFILE_CSS}</style>
      <div className="section profile-header">
        <div className="section-content profile-header-content">
          <div className="profile-header-top">
            <div className="avatar avatar-headshot-lg card-plain profile-avatar-image">
              <span className="avatar-card-link avatar-image-link">
                <PlayerHeadshot id={store.userId} name={store.username} />
              </span>
            </div>
            <div className="header-caption">
              <div className="header-title">
                <h2>{store.username}</h2>
                {bc}
              </div>
              <div className="header-details">
                <ul className="details-info">
                  <li>
                    <div className="text-label">Friends</div>
                    <a className="text-name" href={"/users/" + store.userId + "/friends#!/friends"}><h3>{Number.isSafeInteger(friends.length) ? abbreviateNumber(friends.length) : "..."}</h3></a>
                  </li>
                  <li>
                    <div className="text-label">Followers</div>
                    <a className="text-name" href={"/users/" + store.userId + "/friends#!/followers"}><h3>{Number.isSafeInteger(store.followersCount) ? abbreviateNumber(store.followersCount) : "..."}</h3></a>
                  </li>
                  <li>
                    <div className="text-label">Following</div>
                    <a className="text-name" href={"/users/" + store.userId + "/friends#!/following"}><h3>{Number.isSafeInteger(store.followingsCount) ? abbreviateNumber(store.followingsCount) : "..."}</h3></a>
                  </li>
                  <li>
                    <div className="text-label">RAP</div>
                    <a className="text-name" href={"/users/" + store.userId + "/inventory"}><h3>{rap == null ? "..." : abbreviateNumber(rap)}</h3></a>
                  </li>
                </ul>
                <ul className="details-actions desktop-action">
                  {!isOwn ? (
                    <li className="btn-friends">
                      <button type="button" className={"btn-control-md" + (friendDisabled ? " disabled" : "")} disabled={friendDisabled} onClick={onFriend}>{friendLabel}</button>
                    </li>
                  ) : null}
                  {!isOwn && auth.userId ? (
                    <li className="btn-messages">
                      <a className="btn-control-md" href={"/messages/compose?recipientId=" + store.userId}>Message</a>
                    </li>
                  ) : null}
                </ul>
              </div>
              <div className="header-userstatus">
                {editStatus ? (
                  <div>
                    <input ref={statusInput} className="form-control input-field" maxLength={254} defaultValue={statusText} placeholder="What are you up to?" />
                    <button type="button" className="btn-control-xs header-userstatus-share-button" onClick={() => {
                      const v = statusInput.current ? statusInput.current.value : "";
                      store.setStatus({ status: v });
                      setEditStatus(false);
                      updateStatus({ newStatus: v, userId: auth.userId });
                    }}>Save</button>
                  </div>
                ) : (
                  <div className="header-userstatus-text">
                    <span id="userStatusText" className={"text-overflow" + (isOwn ? " userstatus-editable" : "")} onClick={() => { if (isOwn) setEditStatus(true); }}>{statusText ? '"' + statusText + '"' : (isOwn ? "What are you up to?" : "")}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="profile-header-more">
            <a className="rbx-menu-item" href="#" onClick={(e) => { e.preventDefault(); setMoreOpen(!moreOpen); }}>
              <span className="icon-more"></span>
            </a>
            {moreOpen ? (
              <div className="rbx-popover-content">
                <ul className="dropdown-menu" role="menu">
                  {isOwn ? <li><button type="button" onClick={(e) => { e.preventDefault(); setEditStatus(true); setMoreOpen(false); }}>Update Status</button></li> : null}
                  {!isOwn && auth.userId ? <li><button type="button" onClick={onFollow}>{store.isFollowing ? "Unfollow" : "Follow"}</button></li> : null}
                  <li><a href={"/users/" + store.userId + "/inventory"}>Inventory</a></li>
                  <li><a href={"/internal/collectibles?userId=" + store.userId}>Collectibles</a></li>
                  {!isOwn ? <li><a href="#" onClick={(e) => { e.preventDefault(); window.open("/Trade/TradeWindow.aspx?TradePartnerID=" + store.userId, "_blank", "scrollbars=0, height=608, width=914"); setMoreOpen(false); }}>Trade Items</a></li> : null}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="rbx-tabs-horizontal">
        <ul id="horizontal-tabs" className="nav nav-tabs" role="tablist">
          <li className={"rbx-tab" + (tab === "about" ? " active" : "")}>
            <a className="rbx-tab-heading" href="#about" onClick={(e) => { e.preventDefault(); setTab("about"); }}><span className="text-lead">About</span></a>
          </li>
          <li className={"rbx-tab" + (tab === "creations" ? " active" : "")}>
            <a className="rbx-tab-heading" href="#creations" onClick={(e) => { e.preventDefault(); setTab("creations"); }}><span className="text-lead">Creations</span></a>
          </li>
        </ul>
        <div className="tab-content rbx-tab-content">
          <div className={"tab-pane" + (tab === "about" ? " active" : "")} id="about">
            <div className="section profile-about">
              <div className="container-header"><h3>About</h3></div>
              <div className="section-content">
                <div className="profile-about-content">
                  <pre className="profile-about-text"><span className="profile-about-content-text">{store.userInfo.description || ""}</span></pre>
                </div>
                {!isOwn ? (
                  <div className="profile-about-footer">
                    <a href={"/abusereport/UserProfile?id=" + store.userId} className="abuse-report-link"><span className="text-error">Report Abuse</span></a>
                  </div>
                ) : null}
              </div>
            </div>
            <div className="section profile-avatar">
              <div className="container-header"><h3>Currently Wearing</h3></div>
              <div className="col-sm-6 section-content profile-avatar-left">
                <div className="thumbnail-holder" style={{ width: 300, height: 300 }}>
                  <span className="thumbnail-span"><PlayerImage id={store.userId} name={store.username} /></span>
                </div>
              </div>
              <div className="col-sm-6 section-content profile-avatar-right">
                <div className="profile-avatar-mask">
                  <div className="profile-accoutrements-container">
                    <div className="profile-accoutrements-slider">
                      <ul className="accoutrement-items-container hlist">
                        {wearSlice.map((v) => (
                          <li className="accoutrement-item" key={v.id}>
                            <a href={getItemUrl({ assetId: v.id, name: v.name })}>
                              <AssetThumb className="accoutrement-image" id={v.id} alt={v.name} />
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                    {wearPages > 1 ? (
                      <div className="profile-accoutrements-page-container">
                        {[...Array(wearPages)].map((_, i) => (
                          <span key={i} className={"profile-accoutrements-page" + (i === wearPage ? " page-active" : "")} onClick={() => setWearPage(i)}></span>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
            {collections.length ? (
              <div className="section profile-collections">
                <div className="container-header">
                  <h3>Collections</h3>
                  <a className="btn-secondary-xs btn-more" href={"/users/" + store.userId + "/inventory"}>Inventory</a>
                </div>
                <div className="section-content">
                  <ul className="hlist collections-list item-list">
                    {collections.map((v, i) => {
                      const assetId = v.Id;
                      const url = assetId ? getItemUrl({ assetId, name: v.Name }) : v.AssetSeoUrl;
                      const thumb = v.Thumbnail && v.Thumbnail.Url ? (String(v.Thumbnail.Url).startsWith("http") ? v.Thumbnail.Url : getBaseUrl() + v.Thumbnail.Url) : "";
                      return (
                        <li className="list-item asset-item collections-item" key={i}>
                          <a className="collections-link" href={url} title={v.Name}>
                            <div className="img-container"><img src={thumb} alt={v.Name} /></div>
                            <span className="text-overflow item-name">{v.Name}</span>
                          </a>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              </div>
            ) : null}
            {friends.length ? (
              <div className="section">
                <div className="container-header">
                  <h3>Friends ({friends.length})</h3>
                  <a className="btn-secondary-xs btn-more" href={"/users/" + store.userId + "/friends"}>See All</a>
                </div>
                <div className="section-content">
                  <ul className="hlist friend-list">
                    {friends.slice(0, 9).map((v) => (
                      <li className="list-item friend" key={v.id}>
                        <a className="friend-link" href={"/users/" + v.id + "/profile"}>
                          <span className="avatar-card-fullbody"><PlayerHeadshot id={v.id} name={v.name} /></span>
                          <span className="text-overflow friend-name">{v.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
            {groups.length ? (
              <div className="section">
                <div className="container-header">
                  <h3>Groups</h3>
                  <div className="container-buttons">
                    <button type="button" className={"profile-view-selector " + (groupMode === "slide" ? "btn-secondary-xs" : "btn-control-xs")} onClick={() => setGroupMode("slide")}><span className={"icon-slideshow" + (groupMode === "slide" ? " selected" : "")}></span></button>
                    <button type="button" className={"profile-view-selector " + (groupMode === "grid" ? "btn-secondary-xs" : "btn-control-xs")} onClick={() => setGroupMode("grid")}><span className={"icon-grid" + (groupMode === "grid" ? " selected" : "")}></span></button>
                  </div>
                </div>
                <div className="section-content">
                  {groupMode === "slide" && group ? (
                    <div>
                      <div className="slide-item-container-left">
                        <a href={"/My/Groups.aspx?gid=" + group.group.id}><img className="slide-item-image" src={groupIcons[group.group.id]} alt={group.group.name} /></a>
                      </div>
                      <div className="slide-item-container-right">
                        <h3 className="slide-item-name">{group.group.name}</h3>
                        <p className="slide-item-description">{group.group.description}</p>
                        <div className="slide-item-stats">
                          <p className="slide-item-stat-title">Members</p>
                          <p className="text-lead">{abbreviateNumber(group.group.memberCount || 0)}</p>
                          <p className="slide-item-stat-title">Rank</p>
                          <p className="text-lead">{group.role && group.role.name}</p>
                        </div>
                        {groups.length > 1 ? (
                          <div>
                            <button type="button" className="btn-control-xs" onClick={() => setGroupIdx(groupIdx === 0 ? groups.length - 1 : groupIdx - 1)}>‹</button>
                            <button type="button" className="btn-control-xs" onClick={() => setGroupIdx(groupIdx >= groups.length - 1 ? 0 : groupIdx + 1)}>›</button>
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ) : (
                    <ul className="hlist">
                      {groups.map((g) => (
                        <li className="list-item asset-item" key={g.group.id}>
                          <a href={"/My/Groups.aspx?gid=" + g.group.id}>
                            <img src={groupIcons[g.group.id]} alt={g.group.name} />
                            <span className="text-overflow item-name">{g.group.name}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ) : null}
            {favorites.length ? (
              <div className="section">
                <div className="container-header">
                  <h3>Favorites</h3>
                  <a className="btn-secondary-xs btn-more" href={"/users/" + store.userId + "/favorites"}>See All</a>
                </div>
                <div className="section-content">
                  {favorites.slice(0, 6).map((v) => (
                    <div className="game-card" key={v.Item.AssetId}>
                      <div className="game-card-container">
                        <a className="game-card-link" href={"/games/" + v.Item.AssetId + "/" }>
                          <div className="game-card-thumb-container"><img className="game-card-thumb" alt={v.Item.Name} src={favIcons[v.Item.UniverseId]} /></div>
                          <span className="text-overflow game-card-name">{v.Item.Name}</span>
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
            {badges && badges.length ? (
              <div className="section">
                <div className="container-header">
                  <h3>Roblox Badges</h3>
                  {badges.length > 6 ? <a className="btn-secondary-xs btn-more" href="#" onClick={(e) => { e.preventDefault(); setShowAllBadges(!showAllBadges); }}>{showAllBadges ? "See Less" : "See More"}</a> : null}
                </div>
                <div className="section-content">
                  <ul className={"hlist badge-list" + (showAllBadges ? " badge-list-more" : "")}>
                    {(showAllBadges ? badges : badges.slice(0, 6)).map((v, i) => (
                      <li className="list-item badge-item asset-item" key={i}>
                        <a href="/Badges.aspx" className="badge-link" title={v.name}>
                          <span className={badgeClass(v.name)} title={v.name}></span>
                          <span className="text-overflow item-name">{v.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}
            <div className="section profile-statistics">
              <div className="container-header"><h3>Statistics</h3></div>
              <div className="section-content">
                <ul className="profile-stats-container">
                  <li className="profile-stat">
                    <p className="text-label">Join Date</p>
                    <p className="text-lead">{formatDate(store.userInfo.created)}</p>
                  </li>
                  <li className="profile-stat">
                    <p className="text-label">Place Visits</p>
                    <p className="text-lead">{Number(store.userInfo.placeVisits || 0).toLocaleString()}</p>
                  </li>
                  <li className="profile-stat">
                    <p className="text-label">Forum Posts</p>
                    <p className="text-lead">{Number(store.userInfo.postCount || 0).toLocaleString()}</p>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className={"tab-pane" + (tab === "creations" ? " active" : "")} id="creations">
            <div className="section profile-game">
              <div className="container-header"><h3>Games</h3></div>
              <div className="section-content">
                {games.length === 0 ? <div>This user has no games.</div> : games.map((v) => (
                  <div className="game-card" key={v.id}>
                    <div className="game-card-container">
                      <a className="game-card-link" href={"/games/" + (v.rootPlace && v.rootPlace.id) + "/" }>
                        <div className="game-card-thumb-container"><img className="game-card-thumb" alt={v.name} src={gameIcons[v.id]} /></div>
                        <span className="text-overflow game-card-name">{v.name}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
