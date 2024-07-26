import React, { useState, useEffect } from 'react';
import Logo_header from '../components/Logo_header';
import Footer from '../components/Footer';
import './All_Product.css';

// Import product data
import productData from '../../data/Product-data.json';

function All_Product() {
    const [selectedOption, setSelectedOption] = useState('모든 제품');
    const [filteredProducts, setFilteredProducts] = useState([]);

    const options = [
        { id: 1, value: '라켓' },
        { id: 2, value: '댐프너' },
        { id: 3, value: '보호구' },
        { id: 4, value: '그 외' },
        { id: 5, value: '모든 제품' }
    ];

    const handleOptionClick = (option) => {
        setSelectedOption(option.value);
        console.log(`Selected ID: ${option.id}, Value: ${option.value}`);
    };

    useEffect(() => {
        // Filter products based on selected option
        if (selectedOption === '모든 제품') {
            setFilteredProducts(productData);
        } else {
            setFilteredProducts(
                productData.filter(product => {
                    switch (selectedOption) {
                        case '라켓':
                            return product.category === 'racket';
                        case '댐프너':
                            return product.category === 'dampener';
                        case '보호구':
                            return product.category === 'protective';
                        case '그 외':
                            return product.category === 'etc';
                        default:
                            return false;
                    }
                })
            );
        }
    }, [selectedOption]);

    return (
        <div id="All_Product">
            <Logo_header />
            <div className="All_Product_hd">
                <h3>추천하는 테니스 제품들</h3>
                <div className="custom-select-container">
                    <div className="custom-select">
                        <div className="custom-select-selected">
                            {selectedOption} <span className="material-symbols-rounded">keyboard_arrow_down</span>
                        </div>
                        <div className="custom-select-options">
                            {options.map((option) => (
                                <div
                                    key={option.id}
                                    className="custom-select-option"
                                    onClick={() => handleOptionClick(option)}
                                >
                                    {option.value}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <div className="All_product_main">
                <div className="All_product_main_warp">
                    {filteredProducts.map(product => (
                            <a key={product.id} href={product.link} className="product-item" target='_blank'>
                                <img src={product.img_link} alt={product.name} />
                                <div className="product-item-tx">
                                    <p>
                                        <span className="material-symbols-rounded">step_out</span>        
                                        {product.name}
                                    </p>
                                </div>
                            </a>
                    ))}
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default All_Product;