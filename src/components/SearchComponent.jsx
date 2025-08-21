import React, { useState } from 'react';
import ingredientsData from '../data.json';
import './SearchComponent.css'; // Stil dosyasını oluşturacağız

const SearchComponent = () => {
  const [inputText, setInputText] = useState('');
  const [results, setResults] = useState([]);

  // **İyileştirilmiş handleSearch fonksiyonu**
  const handleSearch = () => {
    // 1. Veri setini bir kez dönüştürüp, arama için optimize edin.
    const normalizedData = Object.entries(ingredientsData).map(([key, value]) => ({
      key: key.toLowerCase(),
      data: value
    }));

    // 2. Kullanıcının girdisini işleyin.
    const enteredIngredients = inputText.toLowerCase().split(',').map(item => item.trim());

    // 3. Tekrarları engellemek için bir Set kullanın.
    const foundIngredients = new Set();
    
    enteredIngredients.forEach(enteredItem => {
      // 4. Arama işlemini gerçekleştirin.
      const found = normalizedData.find(dataItem => dataItem.key.includes(enteredItem));

      if (found) {
        foundIngredients.add(JSON.stringify(found.data)); // Nesneleri JSON formatına dönüştürerek Set'e ekleyin
      }
    });

    // 5. Sonuçları tekrar bir diziye dönüştürün.
    setResults(Array.from(foundIngredients).map(item => JSON.parse(item)));
  };

  const getRiskColor = (risk) => {
    switch (risk) {
      case 'Yüksek':
        return 'risk-high';
      case 'Orta':
        return 'risk-medium';
      case 'Düşük':
        return 'risk-low';
      default:
        return '';
    }
  };

  return (
    <div className="search-container">
      <h2 className="title">Bebek Ürünü İçeriği Analizi</h2>
      <p className="description">
        Ürünün içindekiler listesini virgülle ayırarak aşağıya yapıştırın.
      </p>
      <textarea
        className="text-area"
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="Örn: Su, Gliserin, Paraben, Fenoksietanol..."
      />
      <button className="search-button" onClick={handleSearch}>Analiz Et</button>
      
      <div className="results-container">
        {results.length > 0 ? (
          results.map((item, index) => (
            <div key={index} className={`result-item ${getRiskColor(item.risk)}`}>
              <h3 className="ingredient-name">{item.name}</h3>
              <p className="ingredient-risk">Risk Seviyesi: <strong>{item.risk}</strong></p>
              <p className="ingredient-explanation"><strong>Açıklama:</strong> {item.explanation}</p>
              {item.alternatives && (
                <p className="ingredient-alternatives"><strong>Alternatifler:</strong> {item.alternatives}</p>
              )}
            </div>
          ))
        ) : (
          <p className="no-results">Lütfen içerik girerek analiz yapın.</p>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;