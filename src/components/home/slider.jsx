import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useLoading } from "../LoadingContext"
import { useToast } from "../ToastContext"
import ImageLoader from "../ImageLoader"
import { Link } from "react-router-dom"
import { fetchHomeData } from "../../api/homeservice"
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react"
// Import Swiper styles
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/autoplay"
// Import required modules
import { Pagination, Autoplay } from "swiper/modules"

const BannerGrid = () => {
  const dispatch = useDispatch()
  const { setLoading } = useLoading()
  const { showToast } = useToast()

  const sliders = useSelector((state) => state.home.sliders)
  const sidebars = useSelector((state) => state.home.sidebar)
  const loading = useSelector((state) => state.home.loading)
  const error = useSelector((state) => state.home.error)

  const image1 = sidebars?.image1Sidebars?.[0]?.image_path || ""
  const image2 = sidebars?.image2Sidebars?.[0]?.image_path || ""

  useEffect(() => {
    if (sliders.length === 0) {
      const fetchData = async () => {
        try {
          setLoading(true)
          await dispatch(fetchHomeData())
        } catch (error) {
          showToast(error.message, "error")
        } finally {
          setLoading(false)
        }
      }
      fetchData()
    }
  }, [sliders.length, dispatch, setLoading, showToast])

  useEffect(() => {
    if (error) {
      showToast(error, "error")
    }
  }, [error, showToast])

  if (loading) {
    return (
      <div className="w-100 h-100 d-flex align-items-center justify-content-center">
        <div>Loading...</div>
      </div>
    )
  }

  return (
    <section className="mt-5 container">
      <div className="row g-4 home-banner-slider">
        {/* Left side slider - Swiper implementation */}
        <div className="col-md-8">
          <div className="h-100">
            <Swiper
              modules={[Pagination, Autoplay]}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              loop={true}
              className="w-100 h-100"
            >
              {sliders.map((slide) => (
                <SwiperSlide key={slide.id} className="h-100">
                  <ImageLoader
                    src={slide.image_path || "/placeholder.svg"}
                    alt={`slider-${slide.id}`}
                    className="w-100 h-100 object-fit-cover rounded"
                    style={{ minHeight: "450px" }} // Increased main slider height
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>

        {/* Right side static banners */}
        <div className="col-md-4 static-banners-wrapper d-flex flex-column justify-content-between h-100">
          {/* Top banner - Increased height */}
          <div className="h-40 mb-5">
            <Link to="/api">
              <img
                src={image1 || "/placeholder.svg"}
                alt="Top Banner"
                className="side-banner w-100 h-100 object-fit-cover rounded"
              />
            </Link>
          </div>
          {/* Bottom banner */}
          <div className="h-35">
            <Link to="/car">
              <ImageLoader
                src={image2 || "/placeholder.svg"}
                alt="Bottom Banner"
                className="side-banner side-banner2 w-100 h-100 object-fit-cover rounded"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}

export default BannerGrid
