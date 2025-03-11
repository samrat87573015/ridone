import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Slider from "../components/home/slider";
import FeatureCategories from "../components/home/FeatureCategories";
import PopularProduct from "../components/home/PopularProduct";
import DailyBestSells from "../components/home/DailyBestSells";
import { useSelector, useDispatch } from "react-redux";
import { useLoading } from "../components/LoadingContext";
import { fetchHomeData } from "../api/homeservice";
import { useToast } from "../components/ToastContext";
import CategoryBasedProducts from "../components/home/categorysBaseProduct";
import Compaign from "../components/home/compaign";
export default function Home() {
  const dispatch = useDispatch();
  const { setLoading } = useLoading(); // Access setLoading
  const { showToast } = useToast();
  const error = useSelector((state) => state.home.error);

  // Fetch data only once when the component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        await dispatch(fetchHomeData());
      } catch (error) {
        console.error("Error in fetchData:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch, setLoading]);

  useEffect(() => {
    if (error) {
      showToast(error, "error");
    }
  }, [error, showToast]);

  return (
    <>
      <Header />
      <main>
        <Slider />
        <FeatureCategories />
        <Compaign />
        <PopularProduct />
        <CategoryBasedProducts />
        {/* <DailyBestSells /> */}
      </main>
      <Footer />
    </>
  );
}
