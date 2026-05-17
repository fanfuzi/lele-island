import { useState } from 'react';
import { useGame } from '../store';
import { shopItems, shopCategories } from '../data/shopItems';
import { logActivity } from '../utils/activityLog';

export default function ShopScreen({ onBack }) {
  const { state, dispatch } = useGame();
  const [tab, setTab] = useState('food');

  const currentItems = shopItems.filter(i => i.type === tab);

  function handleBuy(item) {
    if (state.inventory.includes(item.id)) {
      dispatch({ type: 'WEAR_ACCESSORY', payload: item.id });
      logActivity({ type: 'shop', subject: null, gameType: 'wear', metadata: { itemId: item.id } });
    } else {
      dispatch({ type: 'BUY_ITEM', payload: item });
      logActivity({ type: 'shop', subject: null, gameType: 'buy', metadata: { itemId: item.id, price: item.price } });
    }
  }

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="btn-back" onClick={onBack}>← 主页</button>
        <h2>🛒 商店</h2>
        <div className="header-coins">
          ⭐ {state.coins}
        </div>
      </div>

      {/* 分类Tab */}
      <div className="shop-tabs">
        {shopCategories.map(c => (
          <button
            key={c.id}
            className={`shop-tab ${tab === c.id ? 'active' : ''}`}
            onClick={() => setTab(c.id)}
          >
            {c.icon} {c.name}
          </button>
        ))}
      </div>

      {/* 商品列表 */}
      <div className="shop-grid">
        {currentItems.map(item => {
          const owned = state.inventory.includes(item.id);
          const wearing = state.pet.accessories.includes(item.id);
          const canAfford = state.coins >= item.price;

          return (
            <div key={item.id} className={`shop-card ${owned ? 'owned' : ''}`}>
              <div className="shop-item-icon">{item.icon}</div>
              <div className="shop-item-info">
                <div className="shop-item-name">{item.name}</div>
                <div className="shop-item-desc">{item.description}</div>
              </div>
              <div className="shop-item-price">
                {owned ? (
                  <span className="owned-label">{wearing ? '已穿戴' : '已拥有'}</span>
                ) : (
                  <span>⭐ {item.price}</span>
                )}
              </div>
              <button
                className={`btn btn-small ${owned ? (wearing ? 'btn-wearing' : 'btn-owned') : (canAfford ? 'btn-primary' : 'btn-disabled')}`}
                onClick={() => handleBuy(item)}
                disabled={!owned && !canAfford}
              >
                {owned ? (wearing ? '脱下' : '穿戴') : (canAfford ? '购买' : '不够')}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
