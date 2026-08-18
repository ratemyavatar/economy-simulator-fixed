import { useEffect, useState } from "react";
import { getAvatar } from "../../../services/avatar";
import { getItemUrl } from "../../../services/catalog";
import ItemImage from "../../itemImage";
import PlayerImage from "../../playerImage";
import Link from "../../link";

const WEAR_CSS = `
.rbx18-wear{position:relative;margin:0 0 12px}
.rbx18-wear .container-header{margin:3px 0 6px}
.rbx18-wear .container-header::before,.rbx18-wear .container-header::after,.rbx18-wear .section::before,.rbx18-wear .section::after{content:" ";display:table}
.rbx18-wear .container-header::after,.rbx18-wear .section::after{clear:both}
.rbx18-wear .container-header h3{float:left;margin:0;padding:0;font-size:24px;font-weight:700;color:#191919}
.rbx18-wear .profile-avatar-left{background:#fff;padding:0 12px;position:relative;float:left;width:50%;box-shadow:rgba(25,25,25,.3) 0 1px 4px 0;margin:0 0 18px}
.rbx18-wear .thumbnail-holder{margin:0 auto;width:300px;height:300px}
.rbx18-wear .thumbnail-span{display:inline-block;width:300px;height:300px}
.rbx18-wear .thumbnail-span img{width:100%;height:100%;max-height:300px;object-fit:contain}
.rbx18-wear .profile-avatar-right{height:300px;float:left;width:50%;position:relative;margin:0 0 18px}
.rbx18-wear .profile-avatar-mask{background:rgba(117,117,117,.5);position:absolute;width:100%;padding:20px 22px;top:0;left:0;height:100%;box-sizing:border-box}
.rbx18-wear .profile-accoutrements-slider{margin:12px 0 6px;height:220px;overflow:hidden}
.rbx18-wear .accoutrement-items-container{list-style:none;margin:0;padding:0}
.rbx18-wear .accoutrement-items-container::before,.rbx18-wear .accoutrement-items-container::after{content:" ";display:table}
.rbx18-wear .accoutrement-items-container::after{clear:both}
.rbx18-wear .accoutrement-item{float:left;padding:5px;text-align:center;width:25%;position:relative;box-sizing:border-box}
.rbx18-wear .accoutrement-image{border-radius:3px;width:100%;height:auto;min-width:85px;background:#fff;display:block}
.rbx18-wear .profile-accoutrements-page-container{text-align:center}
.rbx18-wear .profile-accoutrements-page{display:inline-block;width:10px;height:10px;border-radius:50%;background:#fff;margin:0 4px;cursor:pointer;opacity:.55}
.rbx18-wear .profile-accoutrements-page.page-active{opacity:1;background:#00a2ff}
@media (max-width:767px){
.rbx18-wear .profile-avatar-left,.rbx18-wear .profile-avatar-right{width:100%;height:auto;float:none}
.rbx18-wear .profile-avatar-mask{position:relative;height:auto}
.rbx18-wear .profile-accoutrements-slider{height:auto}
}
`;

const Avatar = (props) => {
  const { userId } = props;
  const assetsLimit = 8;
  const [assets, setAssets] = useState([]);
  const [assetPage, setAssetPage] = useState(0);
  useEffect(() => {
    getAvatar({ userId }).then((d) => {
      setAssets(d.assets || []);
      setAssetPage(0);
    });
  }, [userId]);
  const pages = Math.max(1, Math.ceil(assets.length / assetsLimit));
  const selected = assets.slice(assetPage * assetsLimit, assetPage * assetsLimit + assetsLimit);
  return (
    <div className="rbx18-wear section profile-avatar">
      <style>{WEAR_CSS}</style>
      <div className="container-header">
        <h3>Currently Wearing</h3>
      </div>
      <div className="profile-avatar-left section-content">
        <div className="thumbnail-holder">
          <span className="thumbnail-span">
            <PlayerImage id={userId} />
          </span>
        </div>
      </div>
      <div className="profile-avatar-right">
        <div className="profile-avatar-mask">
          <div className="profile-accoutrements-slider">
            <ul className="accoutrement-items-container">
              {selected.map((v) => (
                <li className="accoutrement-item" key={v.id}>
                  <Link href={getItemUrl({ name: v.name, assetId: v.id })}>
                    <a title={v.name}>
                      <ItemImage id={v.id} name={v.name} className="accoutrement-image" />
                    </a>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          {pages > 1 ? (
            <div className="profile-accoutrements-page-container">
              {[...Array(pages)].map((_, i) => (
                <span
                  key={i}
                  className={"profile-accoutrements-page" + (i === assetPage ? " page-active" : "")}
                  onClick={() => setAssetPage(i)}
                ></span>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Avatar;
