import React, {useEffect, useState, useRef} from 'react';
import {
  Text,
  ScrollView,
  View,
  Image,
  TouchableOpacity,
  Linking,
  Platform,
  ImageBackground,
  FlatList,
  Pressable,
} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import ProductListView from '../../components/Common/ProductListView';
import {updateCartApi} from '../../services/cart';
import styles from './style';
import Modal from 'react-native-modal';
import {trackStateAdobe, clickStreamApi} from '../../services/analytics';
import {Adjust, AdjustEvent, AdjustConfig} from 'react-native-adjust';
import {
  emptyOrderDetailsFbtProducts,
  setOrderedTime,
} from '../../redux/actions/orders';
import {flashsetCart, setFlashMsn} from '../../redux/actions/flashcart';
import {getCartBySession} from '../../services/cart';
import {setCart} from '../../redux/actions/cart';
import {addtoCart, requestshippingValue} from '../../generic/Cart/index';
import VersionCheck from 'react-native-version-check';
import {deleteProductInStrip} from '../../redux/actions/homestrip';
import {
  getOrderAttributesApi,
  getPastOrdersApi,
  getSuccessFbtProductsApi,
} from '../../services/orders';
import {setPastOrdersUserActivity} from '../../redux/actions/useractivity';
import {NetworkInfo} from 'react-native-network-info';
import LottieView from 'lottie-react-native';
import CustomeIcon from '../../components/Common/CustomeIcon';
import Header from '../../components/Common/Header';
import {getFbtProductsApi, getProduct} from '../../services/products';
import Fbt from '../../components/Common/Fbt';
import SectionTitle from '../../components/Common/SectionTitle';
import GenericProduct from '../../components/Common/GenericProduct';
import {
  fetchOrderDetails,
  setOrderDetailsFbtProducts,
} from '../../redux/actions/orders';
import {fetchProduct} from '../../redux/actions/products';
import {
  adjustPurchaseSuccessEvent,
  adobepageViewEvent,
  clickStreamPurchaseItemsPageLoad,
  modeMap,
  purchaseItemsTrackEvent,
  webEngagePurchaseSucessEvent,
  applyThousandSeparator,
} from '../../generic';
import Dimension from '../../redux/constants/dimensions';
import VariantAddCart from '../../components/Common/VariantAddCart';
import {
  emptyTemporaryCart,
  setOrderAmountSeg,
  setSuccessRoute,
  setTemporaryCart,
} from '../../redux/actions/temporarycart';
import {STATE_STATUS} from '../../redux/constants';
import {addtoFlashCart} from '../../generic/FlashCart';
import {
  useNavigationState,
  useRoute,
  useNavigation,
} from '@react-navigation/native';
import colors from '../../redux/constants/colors';

const SuccessScreen = props => {
  let CheckAnimation = useRef(null);
  const _CheckstartRecognition = e => {
    if (
      CheckAnimation &&
      CheckAnimation.current &&
      CheckAnimation.current.play
    ) {
      CheckAnimation.current.play();
    }
  };
  let animation = useRef(null);
  const _startRecognition = e => {
    if (animation && animation.current && animation.current.play) {
      animation.current.play();
    }
  };

  const backRef = useRef();

  const successParams =
    (props.route.params.response && props.route.params.response.queryObj) ||
    (props.route.params.response && props.route.params.response.data);
  console.log(props.route.params, 'orderDETAIL');
  const invoiceType = props.route.params.invoiceType;
  const isFlashCheckout = props.route.params.flashCheckout;
  const dispatch = useDispatch();
  const sessionId = useSelector(
    state => ((state.authReducer || {}).data || {}).sessionId || '',
  );
  const userId = useSelector(
    state => ((state.authReducer || {}).data || {}).userId || '',
  );
  const token = useSelector(
    state => ((state.authReducer || {}).data || {}).token || '',
  );
  const itemsList = useSelector(
    state => ((state.cartReducer || {}).data || {}).itemsList || [],
  );

  const paymentMethod = modeMap.hasOwnProperty(successParams.mode)
    ? modeMap[successParams.mode]
    : '';
  const cart = useSelector(state => (state.cartReducer || {}).data || {});
  const auth = useSelector(state => (state.authReducer || {}).data || {});
  const [ratingModal, setRatingModal] = useState(false);
  const [animatedView, setAnimatedView] = useState(true);
  const [details, setDetails] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingBuyNow, setIsLoadingBuyNow] = useState(false);
  const [grpProductData, setGrpProductData] = useState({});
  const [grpPdMsn, setGrpPdMsn] = useState('');
  const [grpPdModal, setGrpPdModal] = useState(false);
  const [grpProductLoader, setGrpProductLoader] = useState(false);
  const [variantLoader, setVariantLoader] = useState(false);
  const [cartBuyNow, setCartBuyNow] = useState('cart');
  const [fbtLeafCategoryName, setFbtLeafCategoryName] = useState('');
  const refContainer = useRef(null);
  const [singularProductMsn, setSingularProductMsn] = useState('');
  const [singularProductData, setSingularProductData] = useState({});
  const openRatingModal = () => {
    setRatingModal(!ratingModal);
  };
  const flashItem = useSelector(
    state => ((state.flashcartReducer || {}).data || {}).itemsList || [],
  );
  const flashCart = useSelector(
    state => (state.flashcartReducer || {}).data || {},
  );
  const recentlyViewedData = useSelector(
    state => (state.recentlyViewedReducer || {}).data || [],
  );
  const prepaidDiscountList = useSelector(
    state => ((state.cartReducer || {}).data || {}).prepaidDiscountList || [],
  );
  //fbt handling
  const order_params =
    props?.route?.params?.itemDeatil?.itemsList[0]?.productId;

  const fbtProducts =
    useSelector(state => state.productsReducer[order_params] || {})
      .fbtProducts || {};

  const orderfbtProducts =
    useSelector(state => state.ordersReducer || {}).fbtProducts || {};
  const productsData = useSelector(state => state.productsReducer);
  const rewardSummaryList = useSelector(
    state => ((state.cartReducer || {}).data || {}).rewardSummaryList || [],
  );

  const flashRewardSummaryList = useSelector(
    state =>
      ((state.flashcartReducer || {}).data || {}).rewardSummaryList || [],
  );
  const temporaryRewardSummaryList = useSelector(
    state =>
      ((state.temporaryCartReducer || {}).data || {}).rewardSummaryList || [],
  );
  const temporaryCart = useSelector(
    state => (state.temporaryCartReducer || {}).data || {} || {},
  );

  const temporaryCartStatus = useSelector(
    state =>
      (state.temporaryCartReducer || {}).status || STATE_STATUS.UNFETCHED,
  );

  const orderAmountSeg = useSelector(
    state => (state.temporaryCartReducer || {}).orderAmountSegregation || {},
  );

  const totalRedeemableCoin = useSelector(
    state => ((state.cartReducer || {}).data || {}).totalRedeemableCoin || 0,
  );
  const totalRedeemableCoinFlashCart = useSelector(
    state =>
      ((state.flashcartReducer || {}).data || {}).totalRedeemableCoin || 0,
  );

  const appliedMogliCoins = useSelector(
    state => (state.coinsbalanceReducer || {}).appliedMogliCoins || false,
  );
  const user = useSelector(state => (state.authReducer || {}).data || {});
  const orderFbtProductsStatus = useSelector(
    state =>
      (state.ordersReducer || {}).fbtProductsStatus || STATE_STATUS.UNFETCHED,
  );
  const flashCartStatus = useSelector(
    state => (state.flashcartReducer || {}).status || STATE_STATUS.UNFETCHED,
  );
  const flashMsn = useSelector(
    state => (state.flashcartReducer || {}).currmsn || '',
  );
  const flashoffersList = useSelector(
    state => ((state.flashcartReducer || {}).data || {}).offersList || [],
  );
  const flashPrepaidDiscountList = useSelector(
    state =>
      ((state.flashcartReducer || {}).data || {}).prepaidDiscountList || [],
  );
  const offersList = useSelector(
    state => ((state.cartReducer || {}).data || {}).offersList || [],
  );
  const navigationState = useNavigationState(state => state);
  const route = useRoute();
  const navigation = useNavigation();
  const sampleRes = {
    totalAmount: 4496,
    totalGst: 500,
    totalShipping: 100,
    couponDiscount: 124,
    totalPayableAmount: 5000,
    usedMogliCoins: 5,
  };

  const sampleFbtRes = {
    Glucometers: [{}],
    'Low Tension Cables': [{}],
    'Safety Cables': [{}],
  };

  const flushCartFigs = async ({
    cartItems,
    cartFig,
    isFlashCart,
    isNormalCart,
  }) => {
    cartItems.forEach((_, i) => {
      dispatch(deleteProductInStrip(_.productId, 'Checkout'));
    });
    let cartObj = {
      cartId: cartFig?.cart?.cartId,
      sessionId: cartFig?.cart?.sessionId,
      agentId: cartFig?.cart?.['agentId'],
      userId: auth.userId,
      isPersistant: true,
      createdAt: null,
      updatedAt: null,
      closedAt: null,
      totalAmount: null,
      totalOffer: 0,
      totalAmountWithOffer: null,
      taxes: null,
      totalAmountWithTaxes: null,
      shippingCharges: null,
      currency: null,
      isGift: false,
      giftMessage: null,
      giftPackingCharges: null,
      totalPayableAmount: null,
    };
    let emptyCart = {
      cart: {
        ...(isFlashCart && {
          ...cartObj,
          buyNow: true,
          createdAt: new Date(),
          countryCode: '356',
          noCostEmiDiscount: null,
        }),
        ...(isNormalCart && {
          ...cartObj,
        }),
      },
      itemsList: [],
      addressList: null,
      payment: null,
      deliveryMethod: null,
      offersList: null,
    };
    const {data} = await updateCartApi(emptyCart, sessionId, token);
    if (isFlashCart) {
      dispatch(flashsetCart(data));
      getCurrentCartSession();
    } else {
      dispatch(setCart(data));
    }
  };
  useEffect(() => {
    _CheckstartRecognition();
    _startRecognition();
  }, []);
  const rateMoglix = () => {
    /* InAppReview.RequestInAppReview(); */
    trackStateAdobe('myapp.ctaclick', {
      'myapp.linkpagename': 'moglix:payment success',
      'myapp.channel': 'purchase',
      'myapp.ctaname': 'rate 5 star',
      'myapp.subSection': 'moglix:payment success',
      '&&events': 'event39',
    });
    if (Platform.OS == 'android') {
      Linking.openURL(
        'http://play.google.com/store/apps/details?id=com.moglix.online&hl=en',
      );
    } else {
      Linking.openURL(
        'https://apps.apple.com/in/app/moglix-best-industrial-app/id1493763517',
      );
    }
  };

  useEffect(() => {
    dispatch(setTemporaryCart(isFlashCheckout ? flashCart : cart));

    if (isFlashCheckout) {
      flushCartFigs({
        cartItems: flashItem,
        cartFig: flashCart,
        isFlashCart: true,
        isNormalCart: false,
      });
    } else {
      flushCartFigs({
        cartItems: itemsList,
        cartFig: cart,
        isFlashCart: false,
        isNormalCart: true,
      });
    }
    const timeout = setTimeout(() => {
      setAnimatedView(false);
    }, 2000);
    getOrderAttributes();
    adobeSuccessTrackEvent();
    adjustSuccessEvent();
    webEngageSucessEvent();
    clickStreamApiOrderConfirmation();
    clickStreamPageLoad();
    dispatch(setOrderedTime(new Date().getTime()));
    adobepageViewEvent({
      pageName: 'moglix:Payment success screen',
      channel: 'Payment success screen',
      subSection: 'Payment success screen',
    });
    return () => {
      clearTimeout(timeout);
      if (!backRef.current) {
        props.navigation.navigate('Home');
      }
      setPastOrders();
      dispatch(emptyTemporaryCart({}));
      dispatch(emptyOrderDetailsFbtProducts({}));
    };
  }, []);

  const getOrderAttributes = async () => {
    console.log('api call');
    try {
      const {data} = await getOrderAttributesApi(
        successParams?.orderId,
        sessionId,
        token,
      );
      dispatch(setOrderAmountSeg(data?.data));
    } catch (error) {
      console.log(error);
    }
  };

  const clickStreamApiOrderConfirmation = async () => {
    try {
      let catL1 = [];
      let catL2 = [];
      let catL3 = [];
      let prices = [];
      let msns = [];
      let brand = [];
      let products = [];
      let totalQuantity = 0;
      let totalShipping = 0;
      (itemsList || []).forEach(item => {
        let cats = item.taxonomyCode.split('/');
        prices.push(item.productUnitPrice);
        msns.push(item.productId);
        brand.push(item.brandName);
        totalQuantity = totalQuantity + item.productQuantity;
        totalShipping += item.shipping;
        products.push(
          ';' +
            item.productId +
            ';' +
            item.productQuantity +
            ';' +
            item.productUnitPrice * item.productQuantity +
            ';',
        );
        if (cats[0]) {
          catL1.push(cats[0]);
        }
        if (cats[1]) {
          catL2.push(cats[1]);
        }
        if (cats[2]) {
          catL3.push(cats[2]);
        }
      });
      let mutateItemsList = (itemsList || []).map(_ => {
        let cats = _.taxonomyCode.split('/');
        return {
          category_l1: cats[0] ? cats[0] : '',
          category_l2: cats[1] ? cats[1] : '',
          category_l3: cats[2] ? cats[2] : '',
          price: _.productUnitPrice,
          quantity: _.productQuantity,
        };
      });

      let ipAddress = await NetworkInfo.getIPAddress();
      let dataTracking = {
        message: 'tracking',
        session_id: sessionId,
        cookie: '',
        user_id: userId,
        url: `https://api.moglix.com/order-confirmation?mode=${
          modeMap[successParams.mode]
        }&orderId=${successParams && successParams.orderId}&transactionAmount=${
          successParams.orderAmount
        }`,
        device: 'App',
        ip_address: ipAddress,
        user_agent: '',
        timestamp: new Date().getTime(),
        referrer: '',
        previous_url: '/',
        event_type: 'page_load',
        label: 'order_completed',
        channel: 'Checkout',
        page_type: 'order_confirmation',
        price: prices.join('|'),
        quantity: totalQuantity,
        shipping: totalShipping,
        invoiceType: invoiceType,
        paymentMode: modeMap.hasOwnProperty(successParams.mode)
          ? modeMap[successParams.mode]
          : '',
        itemsList: [...mutateItemsList],
      };
      const {data} = await clickStreamApi(dataTracking, sessionId, token);
    } catch (error) {
      console.log(error);
    }
  };

  const setPastOrders = async () => {
    if (auth.authenticated == 'true') {
      const {data} = await getPastOrdersApi({
        userId,
        sessionId,
        token,
      });
      if (data) {
        dispatch(setPastOrdersUserActivity(data));
      }
    }
  };
  const getCurrentCartSession = async () => {
    if (sessionId && token) {
      const {data} = await getCartBySession(sessionId, token);
      let response = {...data};
      response.cart = {
        ...response.cart,
        userId: userId,
        sessionId: sessionId,
      };
      const shipping = await requestshippingValue(data, sessionId, token);
      dispatch(setCart(shipping));
    }
  };

  const adjustSuccessEvent = () => {
    adjustPurchaseSuccessEvent({
      cartItems: isFlashCheckout ? flashItem : itemsList,
      successParams,
    });
  };

  const webEngageSucessEvent = () => {
    webEngagePurchaseSucessEvent({
      invoiceType,
      modeMap,
      successParams,
      cartItems: isFlashCheckout ? flashItem : itemsList,
      version: `${VersionCheck.getCurrentVersion()}`,
      eventName: 'successCompleted',
    });
  };

  const adobeSuccessTrackEvent = async () => {
    purchaseItemsTrackEvent({
      cartItems: isFlashCheckout ? flashItem : itemsList,
      cartFig: isFlashCheckout ? flashCart : cart,
      successParams,
      modeMap,
      invoiceType,
      pageName: 'moglix:payment success',
      channel: 'moglix:payment success',
      subSection: 'moglix:payment success',
      eventNo: `purchase,event23:${successParams.orderId}`,
      orderSuccess: true,
      fromScreen: 'success',
      paymentMethod,
    });
  };

  const clickStreamPageLoad = () => {
    clickStreamPurchaseItemsPageLoad({
      cartItems: isFlashCheckout ? flashItem : itemsList,
      paymentMethod,
      successParams,
      invoiceType,
      modeMap,
      event_type: 'page_load',
      label: 'order_completed',
      page_type: 'order_confirmation',
      channel: 'Checkout',
      url: ` https://www.moglix.com/order-confirmation?mode=${paymentMethod}&orderId=${successParams.orderId}&transactionAmount=${successParams.orderAmount}`,
    });
  };

  const shopMoreOrdersView = ({viewOrder, shopMore, navigationScreen}) => {
    return (
      <TouchableOpacity
        onPress={() => {
          if (isFlashCheckout) {
            flushCartFigs({
              cartItems: flashItem,
              cartFig: flashCart,
              isFlashCart: true,
              isNormalCart: false,
            });
          } else {
            flushCartFigs({
              cartItems: itemsList,
              cartFig: cart,
              isFlashCart: false,
              isNormalCart: true,
            });
          }
          setPastOrders();
          if (viewOrder) {
            backRef.current = 'Orders';
            props.navigation.replace('Orders', {
              fromOrderStatus: true,
            });
          } else {
            backRef.current = 'Home';
            props.navigation.navigate('Home');
          }
        }}
        style={[
          viewOrder ? styles.viewOrderBtn : styles.shopMoreBtn,
          styles.cartOrderBtn,
        ]}>
        <Text
          style={[
            viewOrder ? styles.viewOrderBtnText : styles.shopMoreBtnText,
            styles.btnText,
          ]}>
          {viewOrder ? 'VIEW ORDER' : 'SHOP MORE'}
        </Text>
      </TouchableOpacity>
    );
  };

  // useEffect(() => {
  //   //fbt api call if not fetched at productsReducer or ordersReducer
  //   // getFbtProducts();
  //   dispatch(fetchProduct(order_params));
  // }, [order_params]);

  useEffect(() => {
    if (
      orderFbtProductsStatus == STATE_STATUS.FETCHED &&
      Object.keys(orderfbtProducts)?.length
    ) {
      let keys = Object.keys(orderfbtProducts);
      console.log(keys, 'keys hai!!!');
      setFbtLeafCategoryName(keys?.[0]);
    }
  }, [orderFbtProductsStatus]);

  useEffect(() => {
    if (temporaryCartStatus == STATE_STATUS.FETCHED) {
      let prodIdList = ([...temporaryCart?.itemsList] || []).map(
        (__, i) => __.productId,
      );
      getFrequentlyBroughtProducts(prodIdList);
    }
  }, [temporaryCartStatus]);

  const getFrequentlyBroughtProducts = async prodIdList => {
    try {
      let payload = {
        prodIdList: [...prodIdList],
      };
      const {data} = await getSuccessFbtProductsApi(payload, sessionId, token);
      console.log(data, 'data hai!!');
      let mockRes = {
        'Safety Shoes': [
          {
            filterAttributesList: null,
            partNumber: 'MSN8KLP2L7OR5V',
            defaultPartNumber: null,
            categoryDetails: [
              {
                categoryCode: '116111700',
                categoryName: 'Safety Shoes',
                taxonomy: 'Safety/Safety Shoes',
                taxonomyCode: '116000000/116111700',
                categoryLink: 'safety-and-security/safety-shoes/116111700',
              },
            ],
            productName:
              'ArmaDuro AD1006 Suede Leather Steel Toe Tan Work Safety Shoes, Size: 7',
            desciption: null,
            shortDesc: null,
            brandDetails: {
              idBrand: '582ee8c1-cba7-4ec6-8dc3-5cbbcbca3670',
              brandName: 'ArmaDuro',
              storedBrandName: 'armaduro',
              friendlyUrl: 'armaduro',
              brandTag: null,
            },
            seoDetails: null,
            productPartDetails: {
              MSN8KLP2L7OR5V: {
                itemCode: 'AD1006',
                images: [
                  {
                    links: {
                      small: 'p/N4ObnKX3AmXuw-small.jpg',
                      thumbnail: 'p/N4ObnKX3AmXuw-thumbnail.jpg',
                      default: 'p/N4ObnKX3AmXuw.jpg',
                      large: 'p/N4ObnKX3AmXuw-large.jpg',
                      xlarge: 'p/N4ObnKX3AmXuw-xlarge.jpg',
                      icon: 'p/N4ObnKX3AmXuw-icon.jpg',
                      xxlarge: 'p/N4ObnKX3AmXuw-xxlarge.jpg',
                      medium: 'p/N4ObnKX3AmXuw-medium.jpg',
                    },
                    moglixImageNumber: 'N4ObnKX3AmXuw',
                    altTag: null,
                    position: 0,
                  },
                  {
                    links: {
                      small: 'p/ZZrHg3SHnqSee-small.jpg',
                      thumbnail: 'p/ZZrHg3SHnqSee-thumbnail.jpg',
                      default: 'p/ZZrHg3SHnqSee.jpg',
                      large: 'p/ZZrHg3SHnqSee-large.jpg',
                      xlarge: 'p/ZZrHg3SHnqSee-xlarge.jpg',
                      icon: 'p/ZZrHg3SHnqSee-icon.jpg',
                      xxlarge: 'p/ZZrHg3SHnqSee-xxlarge.jpg',
                      medium: 'p/ZZrHg3SHnqSee-medium.jpg',
                    },
                    moglixImageNumber: 'ZZrHg3SHnqSee',
                    altTag: null,
                    position: 1,
                  },
                  {
                    links: {
                      small: 'p/jCPPuUkFaoHjf-small.jpg',
                      thumbnail: 'p/jCPPuUkFaoHjf-thumbnail.jpg',
                      default: 'p/jCPPuUkFaoHjf.jpg',
                      large: 'p/jCPPuUkFaoHjf-large.jpg',
                      xlarge: 'p/jCPPuUkFaoHjf-xlarge.jpg',
                      icon: 'p/jCPPuUkFaoHjf-icon.jpg',
                      xxlarge: 'p/jCPPuUkFaoHjf-xxlarge.jpg',
                      medium: 'p/jCPPuUkFaoHjf-medium.jpg',
                    },
                    moglixImageNumber: 'jCPPuUkFaoHjf',
                    altTag: null,
                    position: 2,
                  },
                  {
                    links: {
                      small: 'p/m7hM2rD62VMJP-small.jpg',
                      thumbnail: 'p/m7hM2rD62VMJP-thumbnail.jpg',
                      default: 'p/m7hM2rD62VMJP.jpg',
                      large: 'p/m7hM2rD62VMJP-large.jpg',
                      xlarge: 'p/m7hM2rD62VMJP-xlarge.jpg',
                      icon: 'p/m7hM2rD62VMJP-icon.jpg',
                      xxlarge: 'p/m7hM2rD62VMJP-xxlarge.jpg',
                      medium: 'p/m7hM2rD62VMJP-medium.jpg',
                    },
                    moglixImageNumber: 'm7hM2rD62VMJP',
                    altTag: null,
                    position: 3,
                  },
                  {
                    links: {
                      small: 'p/b5W1qtCr5uMXn-small.jpg',
                      thumbnail: 'p/b5W1qtCr5uMXn-thumbnail.jpg',
                      default: 'p/b5W1qtCr5uMXn.jpg',
                      large: 'p/b5W1qtCr5uMXn-large.jpg',
                      xlarge: 'p/b5W1qtCr5uMXn-xlarge.jpg',
                      icon: 'p/b5W1qtCr5uMXn-icon.jpg',
                      xxlarge: 'p/b5W1qtCr5uMXn-xxlarge.jpg',
                      medium: 'p/b5W1qtCr5uMXn-medium.jpg',
                    },
                    moglixImageNumber: 'b5W1qtCr5uMXn',
                    altTag: null,
                    position: 4,
                  },
                  {
                    links: {
                      small: 'p/bR41JO4bZLu06-small.jpg',
                      thumbnail: 'p/bR41JO4bZLu06-thumbnail.jpg',
                      default: 'p/bR41JO4bZLu06.jpg',
                      large: 'p/bR41JO4bZLu06-large.jpg',
                      xlarge: 'p/bR41JO4bZLu06-xlarge.jpg',
                      icon: 'p/bR41JO4bZLu06-icon.jpg',
                      xxlarge: 'p/bR41JO4bZLu06-xxlarge.jpg',
                      medium: 'p/bR41JO4bZLu06-medium.jpg',
                    },
                    moglixImageNumber: 'bR41JO4bZLu06',
                    altTag: null,
                    position: 5,
                  },
                  {
                    links: {
                      small: 'p/AHkn3xqCAa6nH-small.jpg',
                      thumbnail: 'p/AHkn3xqCAa6nH-thumbnail.jpg',
                      default: 'p/AHkn3xqCAa6nH.jpg',
                      large: 'p/AHkn3xqCAa6nH-large.jpg',
                      xlarge: 'p/AHkn3xqCAa6nH-xlarge.jpg',
                      icon: 'p/AHkn3xqCAa6nH-icon.jpg',
                      xxlarge: 'p/AHkn3xqCAa6nH-xxlarge.jpg',
                      medium: 'p/AHkn3xqCAa6nH-medium.jpg',
                    },
                    moglixImageNumber: 'AHkn3xqCAa6nH',
                    altTag: null,
                    position: 6,
                  },
                ],
                qualityImage: true,
                attributes: {
                  Colour: ['Tan'],
                  Size: ['7'],
                  'Toe Type': ['Steel Toe'],
                  'Upper Material': ['Suede Leather'],
                  'Additional Details': ['Anti Slip Resistance: Yes'],
                  Applications: ['Engineering, Petrochemical & Construction'],
                  Dimensions: ['29x19x11 cm'],
                  'Item Code': ['AD1006'],
                  Lining: ['Textile'],
                  Notes: [
                    'If the Correct Size is Delivered to the Customer. No Return is Accepted',
                    'Images are Only for Reference. Colour may Differ',
                  ],
                  Shape: ['Toe: Round'],
                  Sole: ['Air Mix'],
                  'Steel Toe': ['Yes'],
                  Type: ['Low Ankle'],
                  'Warranty Details': [
                    'Warranty is Applicable for Shoe Sole Only',
                  ],
                  Weight: ['998 g'],
                  'Country of origin': ['India'],
                },
                shipmentDetails: null,
                countriesSellingIn: ['india'],
                productPriceQuantity: null,
                defaultCombination: false,
                variantName:
                  'ArmaDuro AD1006 Suede Leather Steel Toe Tan Work Safety Shoes, Size: 7',
                productLinks: {
                  canonical:
                    'armaduro-ad1006-suede-leather-steel-toe-tan-safety-shoes-size-7/mp/msn8klp2l7or5v',
                  default:
                    'armaduro-ad1006-suede-leather-steel-toe-tan-safety-shoes-size-7/mp/msn8klp2l7or5v',
                },
                productRating: '',
                canonicalUrl:
                  'armaduro-ad1006-suede-leather-steel-toe-tan-safety-shoes-size-7/mp/msn8klp2l7or5v',
              },
            },
            groupedAttributes: {},
            keyFeatures: [
              'Oil, Acid Resistant & Anti-Static',
              'Moisture Wicking Breathable Fabric Lining',
              'Toe can Withstand an Impact of Falling Objects',
            ],
            friendlyUrl:
              'armaduro-ad1006-suede-leather-steel-toe-tan-safety-shoes-size-7',
            groupId: 'MPN1584991933309',
            rating: null,
            quantityAvailable: 1,
            outOfStock: true,
            productTags: null,
            defaultCanonicalUrl: null,
            videosInfo: null,
            documentInfo: null,
            saleType: null,
            packaging: null,
            manufacturerDetails: null,
            packerDetails: null,
            importerDetails: null,
            displayName: null,
            bestBefore: null,
            itemDimension: null,
            itemWeight: null,
            uom: null,
            quantityUom: null,
            weightInKg: null,
            dimensionInCms: null,
            weightSlabInKg: null,
            categoryConfirmationNeed: null,
            gmPercentOnline: null,
            attributeValueUniverse: null,
            returnable: null,
          },
        ],
        'Other Bike Parts': [
          {
            filterAttributesList: null,
            partNumber: 'MSNL5GLQ3VQVK4',
            defaultPartNumber: null,
            categoryDetails: [
              {
                categoryCode: '216203000',
                categoryName: 'Other Bike Parts',
                taxonomy: 'Automotive/Bike Accessories/Other Bike Parts',
                taxonomyCode: '216000000/216200000/216203000',
                categoryLink:
                  'automotive/bike-accessories/other-bike-parts/216203000',
              },
            ],
            productName:
              'RA Accessories Metal Bike Exhaust Muffler Tip for Bajaj Avenger 220 DTS-i',
            desciption: null,
            shortDesc: null,
            brandDetails: {
              idBrand: 'f60a1cf2-c066-401a-ac85-8c02e622ba96',
              brandName: 'RA Accessories',
              storedBrandName: 'ra accessories',
              friendlyUrl: 'ra-accessories',
              brandTag: null,
            },
            seoDetails: null,
            productPartDetails: {
              MSNL5GLQ3VQVK4: {
                itemCode: null,
                images: [
                  {
                    links: {
                      small: 'p/ORQXK44JhIyCq-small.jpg',
                      thumbnail: 'p/ORQXK44JhIyCq-thumbnail.jpg',
                      default: 'p/ORQXK44JhIyCq.jpg',
                      large: 'p/ORQXK44JhIyCq-large.jpg',
                      xlarge: 'p/ORQXK44JhIyCq-xlarge.jpg',
                      icon: 'p/ORQXK44JhIyCq-icon.jpg',
                      xxlarge: 'p/ORQXK44JhIyCq-xxlarge.jpg',
                      medium: 'p/ORQXK44JhIyCq-medium.jpg',
                    },
                    moglixImageNumber: 'ORQXK44JhIyCq',
                    altTag: null,
                    position: 0,
                  },
                ],
                qualityImage: true,
                attributes: {
                  'Baffle System': ['Yes'],
                  Dimensions: ['38x11x14 cm'],
                  Length: ['Muffler Tip: 3.3 inch'],
                  Material: ['Metal'],
                  Model: ['RA_TIP'],
                  Notes: [
                    'Please Check the Size to Confirm that this item Fits your Motorcycle Before Bidding.',
                  ],
                  'Outer Diameter': ['Baffle: 47-48 mm'],
                  'Suitable For': ['Bajaj Avenger 220 DTS-i'],
                  Type: ['Slip-on Exhaust System'],
                  'Vehicle Make': ['Bajaj'],
                  'Vehicle Model': ['Avenger 220 DTS-i'],
                  Weight: ['850 g'],
                  'Country of origin': ['India'],
                },
                shipmentDetails: null,
                countriesSellingIn: ['india'],
                productPriceQuantity: null,
                defaultCombination: false,
                variantName:
                  'RA Accessories Metal Bike Exhaust Muffler Tip for Bajaj Avenger 220 DTS-i',
                productLinks: {
                  canonical:
                    'ra-accessories-metal-bike-exhaust-muffler-tip-for-bajaj-avenger-220-dts-i/mp/msnl5glq3vqvk4',
                  default:
                    'ra-accessories-metal-bike-exhaust-muffler-tip-for-bajaj-avenger-220-dts-i/mp/msnl5glq3vqvk4',
                },
                productRating: '',
                canonicalUrl:
                  'ra-accessories-metal-bike-exhaust-muffler-tip-for-bajaj-avenger-220-dts-i/mp/msnl5glq3vqvk4',
              },
            },
            groupedAttributes: {},
            keyFeatures: [
              'Very Durable Universal Adjustable Muffler Silencer',
              'Effectively Reduce Deep Note Sound & Noise Contamination',
              'Fit for Installation on the Exhaust Pipe Tail',
            ],
            friendlyUrl:
              'ra-accessories-metal-bike-exhaust-muffler-tip-for-bajaj-avenger-220-dts-i',
            groupId: '',
            rating: null,
            quantityAvailable: 1,
            outOfStock: true,
            productTags: null,
            defaultCanonicalUrl: null,
            videosInfo: null,
            documentInfo: null,
            saleType: null,
            packaging: null,
            manufacturerDetails: null,
            packerDetails: null,
            importerDetails: null,
            displayName: null,
            bestBefore: null,
            itemDimension: null,
            itemWeight: null,
            uom: null,
            quantityUom: null,
            weightInKg: null,
            dimensionInCms: null,
            weightSlabInKg: null,
            categoryConfirmationNeed: null,
            gmPercentOnline: null,
            attributeValueUniverse: null,
            returnable: null,
          },
        ],
        'Knee Braces & Supports': [
          {
            filterAttributesList: null,
            partNumber: 'MSN153V8L8DYK3',
            defaultPartNumber: null,
            categoryDetails: [
              {
                categoryCode: '215141200',
                categoryName: 'Knee Braces & Supports',
                taxonomy:
                  'Medical Supplies/Braces, Splints & Supports/Knee Braces & Supports',
                taxonomyCode: '215000000/215140000/215141200',
                categoryLink:
                  'medical-supplies/braces-splints-supports/knee-ankle-braces/215141200',
              },
            ],
            productName: 'Adore Short Type Knee Immobilizer, Size: S, AD-406',
            desciption: null,
            shortDesc: null,
            brandDetails: {
              idBrand: '295b33e4-161e-45fd-9762-0e6ba8290770',
              brandName: 'Adore',
              storedBrandName: 'adore',
              friendlyUrl: 'adore',
              brandTag: null,
            },
            seoDetails: null,
            productPartDetails: {
              MSN153V8L8DYK3: {
                itemCode: 'AD-406',
                images: [
                  {
                    links: {
                      small: 'p/aP7MMgnSaITOS-small.jpg',
                      thumbnail: 'p/aP7MMgnSaITOS-thumbnail.jpg',
                      default: 'p/aP7MMgnSaITOS.jpg',
                      large: 'p/aP7MMgnSaITOS-large.jpg',
                      xlarge: 'p/aP7MMgnSaITOS-xlarge.jpg',
                      icon: 'p/aP7MMgnSaITOS-icon.jpg',
                      xxlarge: 'p/aP7MMgnSaITOS-xxlarge.jpg',
                      medium: 'p/aP7MMgnSaITOS-medium.jpg',
                    },
                    moglixImageNumber: 'aP7MMgnSaITOS',
                    altTag: null,
                    position: 0,
                  },
                  {
                    links: {
                      small: 'p/kTS5kPBxNjnBQ-small.jpg',
                      thumbnail: 'p/kTS5kPBxNjnBQ-thumbnail.jpg',
                      default: 'p/kTS5kPBxNjnBQ.jpg',
                      large: 'p/kTS5kPBxNjnBQ-large.jpg',
                      xlarge: 'p/kTS5kPBxNjnBQ-xlarge.jpg',
                      icon: 'p/kTS5kPBxNjnBQ-icon.jpg',
                      xxlarge: 'p/kTS5kPBxNjnBQ-xxlarge.jpg',
                      medium: 'p/kTS5kPBxNjnBQ-medium.jpg',
                    },
                    moglixImageNumber: 'kTS5kPBxNjnBQ',
                    altTag: null,
                    position: 1,
                  },
                  {
                    links: {
                      small: 'p/VMLKBOchc1eGg-small.jpg',
                      thumbnail: 'p/VMLKBOchc1eGg-thumbnail.jpg',
                      default: 'p/VMLKBOchc1eGg.jpg',
                      large: 'p/VMLKBOchc1eGg-large.jpg',
                      xlarge: 'p/VMLKBOchc1eGg-xlarge.jpg',
                      icon: 'p/VMLKBOchc1eGg-icon.jpg',
                      xxlarge: 'p/VMLKBOchc1eGg-xxlarge.jpg',
                      medium: 'p/VMLKBOchc1eGg-medium.jpg',
                    },
                    moglixImageNumber: 'VMLKBOchc1eGg',
                    altTag: null,
                    position: 2,
                  },
                  {
                    links: {
                      small: 'p/KtiEfDbUkIClB-small.jpg',
                      thumbnail: 'p/KtiEfDbUkIClB-thumbnail.jpg',
                      default: 'p/KtiEfDbUkIClB.jpg',
                      large: 'p/KtiEfDbUkIClB-large.jpg',
                      xlarge: 'p/KtiEfDbUkIClB-xlarge.jpg',
                      icon: 'p/KtiEfDbUkIClB-icon.jpg',
                      xxlarge: 'p/KtiEfDbUkIClB-xxlarge.jpg',
                      medium: 'p/KtiEfDbUkIClB-medium.jpg',
                    },
                    moglixImageNumber: 'KtiEfDbUkIClB',
                    altTag: null,
                    position: 3,
                  },
                  {
                    links: {
                      small: 'p/sdZAIUUViW9mI-small.jpg',
                      thumbnail: 'p/sdZAIUUViW9mI-thumbnail.jpg',
                      default: 'p/sdZAIUUViW9mI.jpg',
                      large: 'p/sdZAIUUViW9mI-large.jpg',
                      xlarge: 'p/sdZAIUUViW9mI-xlarge.jpg',
                      icon: 'p/sdZAIUUViW9mI-icon.jpg',
                      xxlarge: 'p/sdZAIUUViW9mI-xxlarge.jpg',
                      medium: 'p/sdZAIUUViW9mI-medium.jpg',
                    },
                    moglixImageNumber: 'sdZAIUUViW9mI',
                    altTag: null,
                    position: 4,
                  },
                ],
                qualityImage: true,
                attributes: {
                  Size: ['S'],
                  'Item Code': ['AD-406'],
                  'Closure Type': ['Hook & Loop'],
                  'Suitable For': [
                    'Post-cast Care, Ligament Injuries, Tibial Plateau Fractures & Osteochondral Injury',
                    'Patellar Tendon Injury, Post/preoperative Care & Acute Sprains/strains of the Knee',
                  ],
                  'Country of origin': ['India'],
                },
                shipmentDetails: null,
                countriesSellingIn: ['india'],
                productPriceQuantity: null,
                defaultCombination: false,
                variantName:
                  'Adore Short Type Knee Immobilizer, Size: S, AD-406',
                productLinks: {
                  canonical:
                    'adore-short-type-knee-immobilizer-size-s-ad-406/mp/msn153v8l8dyk3',
                  default:
                    'adore-short-type-knee-immobilizer-size-s-ad-406/mp/msn153v8l8dyk3',
                },
                productRating: '',
                canonicalUrl:
                  'adore-short-type-knee-immobilizer-size-s-ad-406/mp/msn153v8l8dyk3',
              },
            },
            groupedAttributes: {},
            keyFeatures: [
              'Hook & Loop Straps with Loop Closures & Extra Strap at the Patellar Region for Proper Fitting Along with Anatomically Shaped Posterior & Lateral Splints Provide Precise Immobilization of the Knee',
            ],
            friendlyUrl: 'adore-short-type-knee-immobilizer-size-s-ad-406',
            groupId: '',
            rating: null,
            quantityAvailable: 1,
            outOfStock: true,
            productTags: null,
            defaultCanonicalUrl: null,
            videosInfo: null,
            documentInfo: null,
            saleType: null,
            packaging: null,
            manufacturerDetails: null,
            packerDetails: null,
            importerDetails: null,
            displayName: null,
            bestBefore: null,
            itemDimension: null,
            itemWeight: null,
            uom: null,
            quantityUom: null,
            weightInKg: null,
            dimensionInCms: null,
            weightSlabInKg: null,
            categoryConfirmationNeed: null,
            gmPercentOnline: null,
            attributeValueUniverse: null,
            returnable: null,
          },
        ],
      };

      let mutateObj = {};
      if (data?.data) {
        mutateObj = {};
        for (let key in data?.data) {
          mutateObj[key] = {
            leafCategory: key,
            productList: data?.data[key],
          };
        }
        dispatch(setOrderDetailsFbtProducts(mutateObj));
      }
    } catch (error) {
      console.log(error);
    }
  };

  const renderItemFbtActivity = ({item}) => {
    return (
      <View
        style={
          fbtLeafCategoryName == item ? styles.activepTag : styles.inactivepTag
        }>
        <Pressable
          onPress={() => {
            setFbtLeafCategoryName(item);
          }}
          android_ripple={{color: '#D9232D', borderless: true}}>
          <Text
            style={
              fbtLeafCategoryName == item
                ? styles.activepTagTxt
                : styles.inactivepTagTxt
            }>
            {item}
          </Text>
        </Pressable>
      </View>
    );
  };

  const renderItemGridFbtCategory = ({item}) => (
    <>
      <GenericProduct
        isLoading={isLoading}
        item={item}
        navigation={props.navigation}
        fromRecentlyViewed={true}
        fromSimilarProducts={true}
        addTocartFromPDP={addTocartFromSuccess}
        isLoadingBuyNow={isLoadingBuyNow}
        fromSuccess={true}
        // buyNowFromPDP={buyNowFromSuccess}
        fromRecentlyViewedInsClick={true}
        fromComponent={'recentlyViewed'}
      />
    </>
  );

  const getFbtKeys = () => {
    let keys = [];
    for (const key in orderfbtProducts) {
      if (
        key &&
        orderfbtProducts[key] &&
        orderfbtProducts[key].productList &&
        orderfbtProducts[key].productList.length !== 0
      ) {
        keys.push(key);
      }
    }

    return keys;
  };

  const renderSuccessFbt = () => {
    let keysLength = getFbtKeys();
    console.log(
      Object.keys(orderfbtProducts).length !== 0 && keysLength.length,
      'hahah',
    );
    if (Object.keys(orderfbtProducts).length !== 0 && keysLength.length) {
      return (
        <View style={{backgroundColor: '#fff'}}>
          <Text
            style={{
              fontSize: Dimension.font16,
              color: '#3C3C3C',
              fontFamily: Dimension.CustomSemiBoldFont,
              paddingTop: Dimension.padding15,
              paddingHorizontal: Dimension.padding15,
            }}>
            People Also Bought These Items
          </Text>
          <FlatList
            data={getFbtKeys() || []}
            keyExtractor={(item, index) => 'key' + index}
            renderItem={renderItemFbtActivity}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              padding: Dimension.padding15,
            }}
          />
          <FlatList
            ref={refContainer}
            data={
              (orderfbtProducts &&
                orderfbtProducts[fbtLeafCategoryName] &&
                orderfbtProducts[fbtLeafCategoryName].productList) ||
              []
            }
            keyExtractor={(item, index) => 'key' + index}
            renderItem={renderItemGridFbtCategory}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{
              paddingHorizontal: Dimension.padding15,
            }}
          />
        </View>
      );
    }
  };

  const renderRecentlyViewed = () => {
    if (recentlyViewedData && recentlyViewedData.length) {
      let currviewed = ([...recentlyViewedData] || []).filter(
        (_, i) => _.partNumber !== order_params,
      );
      let currObj = ([...recentlyViewedData] || []).find(
        (_, i) => _.partNumber == order_params,
      );

      let mutateData = [];
      if (currObj && Object.keys(currObj).length) {
        mutateData = [{...currObj}, ...currviewed];
      } else {
        mutateData = [...currviewed];
      }

      return (
        <>
          <View
            style={{backgroundColor: '#fff', marginTop: Dimension.margin10}}>
            <View
              style={{
                paddingTop: Dimension.padding15,
                paddingHorizontal: Dimension.padding15,
              }}>
              <Text
                style={{
                  fontSize: Dimension.font16,
                  color: '#3C3C3C',
                  fontFamily: Dimension.CustomSemiBoldFont,
                }}>
                Recently Viewed
              </Text>
            </View>
            <FlatList
              data={mutateData || []}
              keyExtractor={(item, index) => 'key' + index}
              renderItem={renderItemGridRecentlyViewed}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{paddingHorizontal: Dimension.padding12}}
            />
          </View>
        </>
      );
    }
  };
  const navigateCart = (msn, productData, quantity) => {
    backRef.current = 'Cart';
    props.navigation.replace('Cart', {
      fromSuccess: true,
    });
    // dispatch(setSuccessRoute(true));
    dispatch(emptyTemporaryCart({}));
    dispatch(emptyOrderDetailsFbtProducts({}));
  };

  const addTocartFromSuccess = async product => {
    setIsLoading(true);
    setGrpProductLoader(true);
    setCartBuyNow('cart');
    console.log(product, 'product!!');
    let productBoData;
    if (typeof product == 'string') {
      productBoData = await getProduct(product);
    } else {
      productBoData = await getProduct(
        product.partNumber || product.moglixPartNumber || product.msn,
      );
    }
    let productData = {...productBoData.data.productBO};

    if (
      productData &&
      productData.filterAttributesList &&
      productData.filterAttributesList.length &&
      productData.filterAttributesList != null
    ) {
      if (productData && productData.quantityAvailable > 0) {
        setGrpProductData(productData);
        if (typeof product == 'string') {
          setGrpPdMsn(product);
        } else {
          setGrpPdMsn(
            product.partNumber || product.moglixPartNumber || product.msn,
          );
        }

        setGrpPdModal(true);
        setIsLoading(false);
        setGrpProductLoader(false);
      } else {
        if (
          productData.productPartDetails &&
          productData.productPartDetails[
            product ||
              product.partNumber ||
              product.moglixPartNumber ||
              product.msn
          ] &&
          productData.productPartDetails[
            product ||
              product.partNumber ||
              product.moglixPartNumber ||
              product.msn
          ].productPriceQuantity !== null
        ) {
          setGrpProductData(productData);
          if (typeof product == 'string') {
            setGrpPdMsn(product);
          } else {
            setGrpPdMsn(
              product.partNumber || product.moglixPartNumber || product.msn,
            );
          }
          setIsLoading(false);
          setGrpProductLoader(false);
        } else {
          setGrpProductLoader(false);
        }
      }
    } else {
      if (typeof product == 'string') {
        await addtoCart(
          cart,
          product,
          productData,
          dispatch,
          sessionId,
          token,
          {push: () => {}},
          1,
          false,
          false,
          false,
          false,
          navigateCart,
          () => {},
          prepaidDiscountList,
        );
      } else {
        await addtoCart(
          cart,
          product.partNumber || product.moglixPartNumber || product.msn,
          productData,
          dispatch,
          sessionId,
          token,
          {push: () => {}},
          1,
          false,
          false,
          false,
          false,
          navigateCart,
          () => {},
          prepaidDiscountList,
        );
      }
      setIsLoading(false);
    }
  };

  // const buyNowFromSuccess = async product => {
  //   setIsLoadingBuyNow(true);
  //   setGrpProductLoader(true);
  //   setCartBuyNow('buynow');
  //   let productBuyNowData;
  //   if (typeof product == 'string') {
  //     productBuyNowData = await getProduct(product);
  //   } else {
  //     productBuyNowData = await getProduct(
  //       product.partNumber ||
  //         product.moglixPartNumber ||
  //         product.msn ||
  //         product.idProduct,
  //     );
  //   }
  //   let productDataBuyNow = {...productBuyNowData.data.productBO};

  //   if (
  //     productDataBuyNow &&
  //     productDataBuyNow.filterAttributesList &&
  //     productDataBuyNow.filterAttributesList.length &&
  //     productDataBuyNow.filterAttributesList != null
  //   ) {
  //     setGrpProductData(productDataBuyNow);
  //     if (typeof product == 'string') {
  //       setGrpPdMsn(product);
  //     } else {
  //       setGrpPdMsn(
  //         product.partNumber ||
  //           product.moglixPartNumber ||
  //           product.msn ||
  //           product.idProduct,
  //       );
  //     }
  //     setVariantLoader(false);
  //     setGrpPdModal(true);
  //     setIsLoadingBuyNow(false);
  //     setIsLoading(false);
  //     setGrpProductLoader(false);
  //   } else {
  //     //setting up the singularProductData
  //     if (productDataBuyNow?.quantityAvailable) {
  //       setSingularProductMsn(
  //         product.partNumber ||
  //           product.moglixPartNumber ||
  //           product.msn ||
  //           product.idProduct ||
  //           product,
  //       );
  //       setSingularProductData(productDataBuyNow);
  //       let productQty =
  //         fromQuickCheckoutQty ||
  //         (productDataBuyNow &&
  //           productDataBuyNow.productPartDetails &&
  //           productDataBuyNow.productPartDetails[
  //             product.partNumber ||
  //               product.moglixPartNumber ||
  //               product.msn ||
  //               product.idProduct ||
  //               product
  //           ] &&
  //           productDataBuyNow.productPartDetails[
  //             product.partNumber ||
  //               product.moglixPartNumber ||
  //               product.msn ||
  //               product.idProduct ||
  //               product
  //           ].productPriceQuantity &&
  //           productDataBuyNow.productPartDetails[
  //             product.partNumber ||
  //               product.moglixPartNumber ||
  //               product.msn ||
  //               product.idProduct ||
  //               product
  //           ].productPriceQuantity.india &&
  //           productDataBuyNow.productPartDetails[
  //             product.partNumber ||
  //               product.moglixPartNumber ||
  //               product.msn ||
  //               product.idProduct ||
  //               product
  //           ].productPriceQuantity.india.moq);

  //       if (auth.authenticated == 'true') {
  //         //checking pincode of address
  //         try {
  //           // buyNow to checkout
  //           buyNowQuickCheckout(product, productDataBuyNow, productQty);
  //         } catch (error) {
  //           console.log(error);
  //         }
  //       }
  //     } else {
  //       setIsLoadingBuyNow(false);
  //       Toast.show({
  //         type: 'error',
  //         text2:
  //           'Product is currently Out of Stock.Please choose another product.',
  //         visibilityTime: 2000,
  //         autoHide: true,
  //       });
  //     }
  //   }
  // };

  const buyNowQuickCheckout = async (
    product,
    productDataBuyNow,
    productQty,
  ) => {
    let mutatedCart = {};
    if (
      Object.keys(flashCart).length == 0 &&
      flashCartStatus == STATE_STATUS.UNFETCHED
    ) {
      mutatedCart = {
        addressList: [...cart.addressList],
        cart: {
          ...cart.cart,
          userId: userId,
        },
        extraOffer: cart.extraOffer,
        itemsList: [],
        offersList: [...offersList],
        payment: null,
      };
    } else {
      mutatedCart = {
        addressList: [...flashCart.addressList],
        cart: {
          ...flashCart.cart,
          userId: userId,
        },
        extraOffer: flashCart.extraOffer,
        itemsList: flashMsn !== product.moglixPartNumber ? [] : [...flashItem],
        offersList: [...flashoffersList],
        payment: null,
      };
    }
    // backRef.current = 'Checkout';
    await addtoFlashCart(
      mutatedCart,
      product.partNumber ||
        product.moglixPartNumber ||
        product.msn ||
        product.idProduct ||
        grpPdMsn ||
        product,
      productDataBuyNow,
      dispatch,
      sessionId,
      token,
      props.navigation,
      productQty,
      false,
      false,
      true,
      auth?.authenticated,
      false,
      false,
      true,
      false,
      flashPrepaidDiscountList,
      true,
      false,
      true,
      // navFn,
    );
    dispatch(
      setFlashMsn(
        product.partNumber ||
          product.moglixPartNumber ||
          product.msn ||
          product.idProduct ||
          product,
      ),
    );
    setIsLoadingBuyNow(false);
  };

  // const navFn = () => {
  //   const currentRoute = route;
  //   if (currentRoute.index === 2) {
  //     const updatedParams = {
  //       flashCheckout: true,
  //     };

  //     props?.navigation?.setParams({
  //       ...updatedParams,
  //     });
  //   }
  // };

  // const navFn = () => {

  // backRef.current = 'Checkout';

  // const newState = {}

  // const routeToUpdate = navigationState.routes.find(
  //   route => route.name === 'Checkout',
  // );

  // if (routeToUpdate) {
  //   props?.navigation.setParams(routeToUpdate.name, {

  //     flashCheckout: true,
  //   });
  // }
  // props.navigation.replace('Checkout', {
  //   flashCheckout: true,
  //   key: 'checkout_screen',
  // });

  // dispatch(emptyTemporaryCart({}));
  // };

  // const navFn = () => {
  // setActivityInd(!inci)
  //   backRef.current = 'Checkout';
  //   props.navigation.replace('Checkout', {
  //     updatedParam: 'fromFlashCheckout',
  //     fromSuccess: true,
  //   });
  //   dispatch(emptyTemporaryCart({}));
  // };

  const variantAddCart = async grppdQuantity => {
    setVariantLoader(true);
    if (cartBuyNow == 'cart') {
      await addtoCart(
        cart,
        grpPdMsn,
        grpProductData,
        dispatch,
        sessionId,
        token,
        {push: () => {}},
        grppdQuantity,
        false,
        false,
        false,
        false,
        navigateToCart,
      );
      setVariantLoader(false);
      setGrpPdModal(false);
    } else {
      let productQty =
        grpProductData &&
        grpProductData.productPartDetails &&
        grpProductData.productPartDetails[grpPdMsn || flashMsn] &&
        grpProductData.productPartDetails[grpPdMsn || flashMsn]
          .productPriceQuantity &&
        grpProductData.productPartDetails[grpPdMsn || flashMsn]
          .productPriceQuantity.india &&
        grpProductData.productPartDetails[grpPdMsn || flashMsn]
          .productPriceQuantity.india.moq;

      try {
        buyNowQuickCheckout(
          grpPdMsn,
          grpProductData,
          grppdQuantity || productQty,
        );
      } catch (error) {
        console.log(error);
      }
    }
  };

  const navigateToCart = () => {
    backRef.current = 'Cart';
    props.navigation.replace('Cart', {
      fromSuccess: true,
    });

    dispatch(emptyTemporaryCart({}));
  };

  const renderItemGridRecentlyViewed = ({item}) => (
    <>
      <GenericProduct
        isLoading={isLoading}
        item={item}
        navigation={props.navigation}
        fromRecentlyViewed={true}
        fromSimilarProducts={true}
        addTocartFromPDP={addTocartFromSuccess}
        isLoadingBuyNow={isLoadingBuyNow}
        fromSuccess={true}
        // buyNowFromPDP={buyNowFromSuccess}
        fromRecentlyViewedInsClick={true}
        fromComponent={'recentlyViewed'}
      />
    </>
  );

  const successView = () => {
    return (
      <View>
        <Header
          navigation={props.navigation}
          showBackToHome={true}
          showCart={false}
          showWishlist={false}
          showSearch={false}
          showLargeSearch={false}
          showBack={false}
        />
        <ScrollView contentContainerStyle={{paddingBottom: 100}}>
          <View style={styles.TopBlackBox}>
            <ImageBackground
              style={styles.TopBlackImage}
              source={require('../../assets/images/OrderSuccessBg.png')}
              resizeMode="contain"></ImageBackground>
            <View style={styles.TopBlackBoxInnerWrap}>
              <View style={{flexDirection: 'row', justifyContent: 'center'}}>
                <Image
                  style={styles.checkImg}
                  source={require('../../assets/images/checkbox-circle.png')}
                  resizeMode="cover"
                />
                <Text style={styles.orderPlacedTxt}>Order Placed</Text>
              </View>
              <Text style={styles.topBigTxt}>Hi {auth.userName}!</Text>
              <Text style={styles.topBigTxt}>
                Thank you for your order. We’ll send a confirmation when your
                order ships.
              </Text>
              <TouchableOpacity
                style={styles.yellowWrapper}
                onPress={() => {
                  props.navigation.navigate('CoinBalance');
                  //  adobeCoinsBalanceStripEvent();
                }}>
                <View style={{flexDirection: 'row'}}>
                  <Image
                    style={styles.coinImg}
                    source={require('../../assets/images/Coin.png')}
                    resizeMode="contain"
                  />
                  <Text style={styles.LpBoldTxt}>
                    {totalEarnedMogliCoins()} Mogli Coins on the way
                  </Text>
                </View>
              </TouchableOpacity>
              <Text style={styles.topSmallTxt}>
                Please Note: You will lose Mogli Coins if you return the order.
              </Text>
            </View>
          </View>

          <View style={styles.prodListHorz}>
            <View style={styles.orderIdRow}>
              <View style={{width: '70%'}}>
                <Text style={styles.ordId}>
                  Order ID : {successParams.orderId}
                </Text>
                <Text
                  style={[
                    styles.ordItemCounts,
                    {marginTop: -Dimension.margin5},
                  ]}>
                  {temporaryCart?.itemsList?.length} Items
                </Text>
              </View>
              <View style={{width: '30%'}}>
                {shopMoreOrdersView({
                  viewOrder: true,
                  shopMore: false,
                  navigationScreen: 'Orders',
                })}
              </View>
            </View>
            <View
              style={{
                marginVertical: Dimension.margin15,
                alignItems: 'center',
                width: '100%',
              }}>
              <ScrollView
                horizontal={true}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{
                  paddingLeft: Dimension.padding10,
                }}>
                {(temporaryCart?.itemsList || []).map((item, index) => (
                  <ProductListView
                    key={index}
                    parentStyles={styles.prodListView}
                    fromHome
                    item={item}
                    orderedItemsLength={temporaryCart?.itemsList.length}
                    navigation={props.navigation}
                    fromSuccess={true}
                  />
                ))}
              </ScrollView>
            </View>
            <View>
              <View style={styles.Owrap}>
                <Text style={styles.headingtxt}>Order Details</Text>
                <TouchableOpacity
                  onPress={() => setDetails(!details)}
                  style={styles.seePriceWithTax}>
                  <View style={styles.arrowWrap}>
                    <CustomeIcon
                      name={details ? 'arrow_up' : 'arrow_down-1'}
                      style={styles.arrowIcon}></CustomeIcon>
                  </View>
                </TouchableOpacity>
              </View>
              {details ? (
                <>
                  <View style={styles.collapsedArea}>
                    <View style={styles.collapsedRow}>
                      <Text
                        style={[
                          styles.gst,
                          {
                            marginBottom: Dimension.margin16,
                            marginTop: Dimension.margin20,
                          },
                        ]}>
                        Amount
                      </Text>
                      <Text style={[styles.gst, styles.gstVal]}>
                        ₹{orderAmountSeg?.totalProductPriceWithoutTax}
                      </Text>
                    </View>
                    <View style={styles.collapsedRow}>
                      <Text style={[styles.gst, ,]}>GST</Text>
                      <Text style={[styles.gst, styles.gstVal]}>
                        ₹{orderAmountSeg?.totalTax}
                      </Text>
                    </View>
                    <View style={styles.collapsedRow}>
                      <Text style={[styles.gst]}>Shipping</Text>
                      <Text style={[styles.gst, styles.gstVal]}>
                        ₹{orderAmountSeg?.shippingCharges}
                      </Text>
                    </View>

                    <View style={styles.collapsedRow}>
                      <Text style={[styles.gst]}>Coupon Discount</Text>
                      <Text
                        style={[
                          styles.gst,
                          styles.gstVal,
                          {
                            color:
                              orderAmountSeg?.promoOffer +
                                orderAmountSeg?.noCostEmiDiscount +
                                orderAmountSeg?.totalCoinDiscount +
                                orderAmountSeg?.totalPrepaidDiscount >
                              0
                                ? colors.BoldgreenText
                                : colors.PrimaryTextColor,
                          },
                        ]}>
                        ₹
                        {orderAmountSeg?.promoOffer +
                          orderAmountSeg?.noCostEmiDiscount +
                          orderAmountSeg?.totalCoinDiscount +
                          orderAmountSeg?.totalPrepaidDiscount}
                      </Text>
                    </View>
                    {orderAmountSeg?.totalCoinDiscount ? (
                      <View style={styles.collapsedRow}>
                        <Text style={styles.gst}>Mogli Coins</Text>
                        <Text style={[styles.gst, styles.gstVal]}>
                          ₹{orderAmountSeg?.orderAmountSeg}
                        </Text>
                      </View>
                    ) : null}
                  </View>
                </>
              ) : null}
              <View style={styles.Owrap}>
                <Text style={styles.headingtxt}>Total Paid Amount</Text>
                <Text style={styles.headingVal}>
                  ₹ {orderAmountSeg?.totalPayable}
                </Text>
              </View>
              <View style={[styles.Owrap, {paddingBottom: 0}]}>
                <Text style={styles.headingtxt}>Payment Mode</Text>
                <Text style={styles.headingVal}>
                  {modeMap[successParams.mode]}
                </Text>
              </View>
            </View>
          </View>
          <TouchableOpacity
            style={styles.LpBalanceWrap}
            onPress={() => {
              props.navigation.navigate('CoinBalance');
              //  adobeCoinsBalanceStripEvent();
            }}>
            <Image
              source={require('../../assets/images/Coin.png')}
              style={styles.LpBalanceIconImg}
              resizeMode="contain"
            />
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                width: '90%',
                alignItems: 'center',
              }}>
              <View>
                <Text style={styles.LpBalanceBoldTxt}>
                  Check Mogli Coins Balance
                </Text>
              </View>
              <CustomeIcon
                name="arrow_next"
                style={{color: '#fff'}}
                size={24}></CustomeIcon>
            </View>
          </TouchableOpacity>
          {renderSuccessFbt()}
          {renderRecentlyViewed()}
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('CoinBalance');
            }}
            style={{marginVertical: Dimension.margin12}}>
            <Image
              source={require('../../assets/images/CoinBanner.png')}
              style={styles.CoinsBanner}
              resizeMode="contain"
            />
          </TouchableOpacity>
          <View style={styles.successWrap}>
            <View style={styles.rateWrap}>
              <View style={styles.rateContent}>
                <Image
                  source={require('../../assets/images/rate_us_star.png')}
                  style={styles.rateusImg}
                />
                <View style={styles.rateText}>
                  <Text style={styles.rateusBoldtext}>
                    Like the Moglix App !
                  </Text>
                  <Text style={styles.rateusSmalltext}>
                    {Platform.OS == 'android'
                      ? 'Rate us on Play Store.'
                      : 'Rate us on App Store.'}
                  </Text>
                </View>
              </View>
              <TouchableOpacity style={styles.rateBtn} onPress={rateMoglix}>
                <Text style={styles.shopMoreBtnText}>RATE US</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <View style={styles.cartOrderView}>
          {shopMoreOrdersView({
            viewOrder: false,
            shopMore: true,
            navigationScreen: 'Home',
          })}
        </View>
        <Modal isVisible={ratingModal}>
          <View style={styles.ratingModalInner}>
            <Text style={styles.rateModalHeading}>Did you like the app?</Text>
            <Image
              source={require('../../assets/images/star_rating.png')}
              style={styles.modalcoupenImg}
              resizeMode="contain"
            />
            <Text style={styles.userText}>
              Hi <Text style={styles.boldName}> {auth.userName},</Text>
              {'\n'}take a minute to rate this app{'\n'} and help support to
              improve more {'\n'}new features
            </Text>
            <TouchableOpacity onPress={rateMoglix} style={styles.rateUsBtn}>
              <Text style={styles.rateUsBtnText}>RATE US NOW</Text>
            </TouchableOpacity>
            <View style={styles.rateActions}>
              <TouchableOpacity onPress={openRatingModal}>
                <Text style={styles.actionText}>NO,THANKS</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={openRatingModal}>
                <Text style={styles.actionText}>REMIND ME LATER</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    );
  };

  const totalEarnedMogliCoins = () => {
    return temporaryRewardSummaryList?.reduce(
      (acc, curr) => acc + curr?.earnedCoin,
      0,
    );
  };

  const mogliCoinsAnimatedView = () => {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#E0FDDF',
        }}>
        <View style={{alignSelf: 'center'}}>
          <LottieView
            ref={CheckAnimation}
            style={{width: 150, height: 150}}
            source={require('../../assets/Lottie/animation_lm5xmtb9.json')}
          />
        </View>
        <View style={{alignSelf: 'center', marginVertical: Dimension.margin10}}>
          <Text numberOfLines={1} style={styles.SuccessText}>
            Order Placed Successfully
          </Text>
          {orderAmountSeg?.promoOffer +
            orderAmountSeg?.noCostEmiDiscount +
            orderAmountSeg?.totalCoinDiscount +
            orderAmountSeg?.totalPrepaidDiscount >
          0 ? (
            <Text style={styles.SuccessLightText}>
              Yay! You saved ₹
              {orderAmountSeg?.promoOffer +
                orderAmountSeg?.noCostEmiDiscount +
                orderAmountSeg?.totalCoinDiscount +
                orderAmountSeg?.totalPrepaidDiscount}
              on this order
            </Text>
          ) : null}
          {temporaryRewardSummaryList?.length ? (
            <TouchableOpacity
              style={styles.yellowWrapper}
              onPress={() => {
                props.navigation.navigate('CoinBalance');
                //  adobeCoinsBalanceStripEvent();
              }}>
              <View style={{flexDirection: 'row'}}>
                <Image
                  style={styles.coinImg}
                  source={require('../../assets/images/Coin.png')}
                  resizeMode="contain"
                />
                <Text style={styles.LpBoldTxt}>
                  {totalEarnedMogliCoins()} Mogli Coins on the way
                </Text>
              </View>
            </TouchableOpacity>
          ) : null}
        </View>
        <View style={{alignSelf: 'center'}}>
          <LottieView
            ref={animation}
            style={{
              width: '100%',
              height: '100%',
              justifyContent: 'center',
              alignItems: 'center',
            }}
            source={require('../../assets/Lottie/animation_lm4sd56q.json')}
          />
        </View>
      </View>
    );
  };

  return (
    <>
      {animatedView ? mogliCoinsAnimatedView() : successView()}
      {grpPdModal && (
        <VariantAddCart
          closeSelectVariant
          grpPdModal={grpPdModal}
          setGrpPdModal={setGrpPdModal}
          grpProductData={grpProductData}
          refetchWithMsn={
            cartBuyNow == 'cart' ? addTocartFromSuccess : () => {}
          }
          grpPdMsn={grpPdMsn}
          variantAddCart={variantAddCart}
          sessionId={sessionId}
          token={token}
          userId={userId}
          user={user}
          grpProductLoader={grpProductLoader}
          variantLoader={variantLoader}
          cartBuyNow={cartBuyNow}
          fromPdp={true}
          navigation={props.navigation}
        />
      )}
    </>
  );
};

export default SuccessScreen;
