import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useDispatch } from 'react-redux'
import { fetchHomeData } from '../api/homeservice'
import { useLoading } from '../components/LoadingContext'

export default function DynamicPage() {
  const { setLoading } = useLoading(); // Access setLoading

  const dispatch=useDispatch();
  
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


    const { pageType } = useParams()
  
    
    // Select pages from Redux store
    const pages = useSelector(state => state.home.siteinfos.pages)
    
    // Find the page that matches the URL parameter
    const currentPage = pages?.find(page => page.type === pageType)

    return (
        <div>
            <Header/>
            <main className="container mx-auto px-4 py-8">
                {currentPage ? (
                    <div 
                        className="prose max-w-none" 
                        dangerouslySetInnerHTML={{ __html: currentPage.content }}
                    />
                ) : (
                    <div className="text-center text-gray-600">
                        <h1>Page Not Found</h1>
                        <p>The page you are looking for does not exist.</p>
                    </div>
                )}
            </main>
            <Footer/>
        </div>
    )
}