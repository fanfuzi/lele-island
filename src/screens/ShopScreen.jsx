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
      // 服装类可以穿戴/脱下，家具类可以摆放
      if (item.type === 'clothing') {
        dispatch({ type: 'WEAR_ACCESSORY', payload: item.id });
        logActivity({ type: 'shop', subject: null, gameType: 'wear', metadata: { itemId: item.id } });
      } else if (item.type === 'furniture') {
        dispatch({ type: 'PLACE_FURNITURE', payload: item.id });
        logActivity({ type: 'shop', subject: null, gameType: 'place', metadata: { itemId: item.id } });
      }
    } else {
      dispatch({ type: 'BUY_ITEM', payload: item });
      logActivity({ type: 'shop', subject: null, gameType: 'buy', metadata: { itemId: item.id, price: item.price } });
    }
  }

  const currencyIcon = (item) => item.priceType === 'stars' ? '🌟' : '🪙';
  const balanceFor = (item) => item.priceType === 'stars' ? state.stars : state.coins;

  return (
    <div className="screen">
      <div className="screen-header">
        <button className="btn-back" onClick={onBack}>← 主页</button>
        <h2>🛒 商店</h2>
        <div className="header-coins">
          <span className="header-currency">🪙 {state.coins}</span>
          <span className="header-currency">🌟 {state.stars}</span>
        </div>
      </div>

      <div className="shop-balance-bar">
        <span>🪙 余额 <strong>{state.coins}</strong></span>
        <span>🌟 余额 <strong>{state.stars}</strong></span>
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
          const placed = state.furniture.some(f => f.id === item.id);
          const canAfford = balanceFor(item) >= item.price;

          let actionLabel = '购买';
          if (owned) {
            if (item.type === 'clothing') actionLabel = wearing ? '脱下' : '穿戴';
            else if (item.type === 'furniture') actionLabel = placed ? '收起' : '摆放';
            else actionLabel = '已拥有';
          } else if (!canAfford) {
            actionLabel = '不够';
          }

          return (
            <div key={item.id} className={`shop-card ${owned ? 'owned' : ''}`}>
              <div className="shop-item-icon">{item.icon}</div>
              <div className="shop-item-info">
                <div className="shop-item-name">{item.name}</div>
                <div className="shop-item-desc">{item.description}</div>
              </div>
              <div className="shop-item-price">
                {owned ? (
                  <span className="owned-label">
                    {wearing ? '已穿戴' : placed ? '已摆放' : '已拥有'}
                  </span>
                ) : (
                  <span>{currencyIcon(item)} {item.price}</span>
                )}
              </div>
              <button
                className={`btn btn-small ${owned ? (wearing || placed ? 'btn-wearing' : 'btn-owned') : (canAfford ? 'btn-primary' : 'btn-disabled')}`}
                onClick={() => handleBuy(item)}
                disabled={!owned && !canAfford}
              >
                {actionLabel}
              </button>
            </div>
          );
        })}
      </div>

      <div className="shop-currency-hint">
        <span>🪙 金币：每做一题获得（买食物）</span>
        <span>🌟 星星：每题1★ + 全科完成额外奖励（买服装/家具）</span>
      </div>
    </div>
  );
}
