import React, { useState, useEffect } from 'react';
import styles from './index.module.css';
import PrereviewImageLeft from "./220-SM837746.jpg";
import '@fortawesome/fontawesome-free/css/all.min.css';
import Cart from '../../component/Cart'

export default function Index({ productData,Setting }) {
    const [currentReview, setCurrentReview] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [activeTab, setActiveTab] = useState(null);

    // Use the review images from productData if available
    const reviews = JSON.parse(productData.review_images || '[]');

    const toggleTab = (index) => {
        setActiveTab(activeTab === index ? null : index);
    };

    const nextReview = () => {
        setCurrentReview((prev) => (prev + 1) % reviews.length);
    };

    const prevReview = () => {
        setCurrentReview((prev) => (prev - 1 + reviews.length) % reviews.length);
    };

    const handleBulletClick = (index) => {
        setCurrentReview(index);
    };

    // Auto-slide functionality
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentReview((prev) => (prev + 1) % reviews.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [reviews.length]);

    // Touch handling for swiping
    const handleTouchStart = (e) => {
        setTouchStart(e.touches[0].clientX);
    };

    const handleTouchMove = (e) => {
        setTouchEnd(e.touches[0].clientX);
    };

    const handleTouchEnd = () => {
        if (touchStart - touchEnd > 50) {
            nextReview(); // Swipe left
        } else if (touchEnd - touchStart > 50) {
            prevReview(); // Swipe right
        }
    };

    const faqQuestions = JSON.parse(productData.faq_questions || '[]');
    const faqAns = JSON.parse(productData.faq_answers || '[]');

    return (
        <div className={styles.template1}>
            <div className={styles.container}>
                <div className={styles.header}>
                    <div className={styles.headerTitle}>
                        {productData?.header_title || 'শুধুমাত্র আজকের জন্য স্পেশাল অফার - ৩০% ছাড় - প্রিমিয়াম আনারকলি থ্রিপিস'}
                    </div>
                </div>
                <div className={styles.subtitle}>
                    {productData?.name || 'শুধুমাত্র আজকের জন্য স্পেশাল অফার - ৩০% ছাড় - প্রিমিয়াম আনারকলি থ্রিপিস'}
                </div>
                <div className={styles.iframe}>
                    {productData?.video_url ? (
                          <iframe width="560" height="315" src={"https://www.youtube.com/embed/"+productData.video_url} title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>

                      
                    ) : (
                        <video width="320" height="240" controls>
                        <source src={productData.video_url} type="video/mp4"/>

                        </video>

                    )}
                    <div className={styles.titleUnderIframe}>
                        রেগুলার প্রাইস {productData?.previous_price || '১৬৫০'} টাকা। আজকের অফার প্রাইস {productData?.price || '১২৫০'} টাকা
                    </div>
                </div>
                <div className={styles.containerOfOrderBtn}>
                    <button className={styles.btnOrder}>অর্ডার করুন</button>
                </div>
            </div>

            <div className={styles.container}>
                <section className={styles.tabsOfFaqs}>
                    <div className={styles.tabsOfFaqsBG}>
                        <div className={styles.title}>
                            {productData?.faq_section_title || 'একদম ফ্রি সাইজ। বডি সাইজ ৪৪। সাইজ অনুযায়ী কমিয়ে নিতে পারবেন ৪৪ থেকে ৩২ পর্যন্ত করে নিতে পারবেন।'}
                        </div>
                        <div className={styles.tabs}>
                            {faqQuestions.map((question, index) => (
                                <div className={styles.tab} key={index} onClick={() => toggleTab(index)}>
                                    <div className={styles.tabtitle}>
                                        <span className={activeTab === index ? styles.activeTabTitle : ''}>
                                            {question}
                                        </span>
                                        <i className={`fas ${activeTab === index ? 'fa-chevron-up' : 'fa-chevron-down'}`} />
                                    </div>
                                    {activeTab === index && (
                                        <div className={styles.descibe}>{faqAns[index]}</div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className={styles.PreviewOfaProduct}>
                    <div className={styles.PreviewOfaProductTtile}>
                        {productData?.section_title || 'স্বাদে ও পুস্টিগুনে ভরপুর খাবারই একমাত্র উপায়'}
                    </div>
                    <div className={styles.row}>
                        <div className={styles.PreviewOfaleft}>
                            <img src={productData?.featured_image || PrereviewImageLeft} alt="Featured Product" />
                        </div>
                        <div className={styles.PreviewOfaright}>
                            <div dangerouslySetInnerHTML={{ __html: productData?.product_description }} />
                        </div>
                    </div>
                    <div className={styles.btnofOrderbyPreview}>অর্ডার করতে চাই</div>
                </section>
            </div>

            <div className={styles.container}>
                <section className={styles.customerReview}>
                    <div className={styles.titleReview}>বুক রিভিউ</div>
                    <div
                        className={styles.customerReviewreviews}
                        onTouchStart={handleTouchStart}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleTouchEnd}
                    >
                        <div
                            className={styles.reviewSlider}
                            style={{
                                transform: `translateX(-${currentReview * (100 / (reviews.length || 1))}%)`,
                                transition: 'transform 0.5s ease-in-out',
                            }}
                        >
                            {reviews.length > 0 ? (
                                reviews.map((imgUrl, index) => (
                                    <div key={index} className={styles.customerReviewreview}>
                                        <img src={imgUrl} alt={`Customer Review ${index + 1}`} />
                                    </div>
                                ))
                            ) : (
                                <p>No reviews available</p>
                            )}
                        </div>
                    </div>

                    <div className={styles.bulletPoints}>
                        {reviews.map((_, index) => (
                            <span
                                key={index}
                                className={`${styles.bullet} ${currentReview === index ? styles.activeBullet : ''}`}
                                onClick={() => handleBulletClick(index)}
                            >
                                •
                            </span>
                        ))}
                    </div>

                    <div className={styles.containerOfOrderBtn}>
                        <button className={styles.btnOrder}>অর্ডার করতে চাই</button>
                    </div>
                </section>
                <section className={styles.callForNeed}>
                    যে কোন প্রয়োজনে কল করুন 01886238827
                </section>
                <Cart product={productData} Setting={Setting} />
            </div>
            

        </div>
    );
}
