import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Image,
} from 'react-native';
import Dimension from '../../redux/constants/dimensions';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Colors from '../../redux/constants/colors';
import {
  getOffer,
  getApplicablePromoCodes,
  getProductPrePaidDiscountApi,
} from '../../services/products';
import {
  setApplicablePromoCodes,
  setProductOffer,
  setProductPrePaidDiscountBrandCategory,
} from '../../redux/actions/products';
import {useDispatch, useSelector} from 'react-redux';
import {STATE_STATUS} from '../../redux/constants';
import SectionTitle from './SectionTitle';
import CustomeIcon from './CustomeIcon';
import Modal from 'react-native-modal';
import {trackStateAdobe} from '../../services/analytics';
import {switchLanguage} from '../../generic/vernacular';
import Clipboard from '@react-native-clipboard/clipboard';

const deviceWidth = Dimensions.get('window').width;

const FreeShipping = props => {
  const {
    isHindi,
    productData,
    copied,
    setCopied,
    copiedCoupon,
    setCopiedCoupon,
  } = props;
  const dispatch = useDispatch();
  const offer = useSelector(
    state => state.productsReducer[props.msn].offer || {},
  );

  const applicablePromoCodeList = useSelector(
    state =>
      ((state.productsReducer[props.msn] || {}).applicablePromoCodes || {})
        .data || {},
  );
  const applicablePromoCodeListStatus = useSelector(
    state =>
      ((state.productsReducer[props.msn] || {}).applicablePromoCodes || {})
        .status || STATE_STATUS.UNFETCHED,
  );

  const productPrePaidDiscountStatus = useSelector(
    state =>
      ((state.productsReducer[props.msn] || {}).productPrePaidDiscount || {})
        .status || STATE_STATUS.UNFETCHED,
  );

  const productPrePaidDiscountData = useSelector(
    state =>
      ((state.productsReducer[props.msn] || {}).productPrePaidDiscount || {})
        .data || {},
  );

  const [showOffer, setShowOffer] = useState(false);
  const [couponsLoader, setCouponsLoader] = useState(true);
  const [promoModal, setPromoModal] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState('');

  useEffect(() => {
    if (offer && offer.status !== STATE_STATUS.FETCHED) {
      getShowOffer();
    } else {
      if (offer.data) {
        setCouponsLoader(false);
        setShowOffer(true);
      }
    }
    if (applicablePromoCodeListStatus !== STATE_STATUS.FETCHED) {
      getAllApplicablePromoCodes();
    }
    if (productPrePaidDiscountStatus !== STATE_STATUS.FETCHED) {
      getPrePaidDiscountByBrandCategory();
    }
  }, []);

  const getShowOffer = async () => {
    const {data} = await getOffer({
      itemsList: [
        {
          categoryId: props.categoryCode,
          productId: props.msn.toUpperCase(),
          taxonomy: props.taxonomyCode,
        },
      ],
      totalPayableAmount: props.price,
    });
    if (data.data) {
      dispatch(setProductOffer(props.msn, data.data));
      setCouponsLoader(false);
      setShowOffer(true);
    }
  };

  const adobeSeeMoreCopyCouponEvent = () => {
    let obj = {
      'myapp.linkpagename': 'pdp',
      'myapp.ctaname': 'copy coupon other on pdp clicked',
      'myapp.channel': 'pdp',
      'myapp.subSection': 'Other coupons clicked',
      '&&events': 'event9988',
    };
    trackStateAdobe('myapp.ctaclick', obj);
  };

  const copyCoupon = code => {
    adobeCopyCouponClickEvent();
    Clipboard.setString(code);
    setCopied(true);
    setCopiedCoupon(false);
  };

  const adobeCopyCouponClickEvent = () => {
    let obj = {
      'myapp.linkpagename': 'pdp',
      'myapp.ctaname': 'copy coupon on pdp clicked',
      'myapp.channel': 'pdp',
      'myapp.subSection': 'First coupon clicked',
      '&&events': 'event9988',
    };
    trackStateAdobe('myapp.ctaclick', obj);
  };

  const copyCouponCode = code => {
    adobeSeeMoreCopyCouponEvent();
    Clipboard.setString(code);
    setSelectedCoupon(code);
    setCopiedCoupon(true);
    setCopied(false);
  };

  const getAllApplicablePromoCodes = async () => {
    if (props.authenticated == 'true') {
      const {data} = await getApplicablePromoCodes({
        msn: props.msn,
        device: 'app',
        userId: props.userId,
        isHindi: isHindi,
      });
      if (data.data) {
        dispatch(setApplicablePromoCodes(props.msn, data.data));
      }
    } else {
      const {data} = await getApplicablePromoCodes({
        msn: props.msn,
        device: 'app',
        isHindi: isHindi,
      });
      if (data.data) {
        dispatch(setApplicablePromoCodes(props.msn, data.data));
      }
    }
  };

  const getPrePaidDiscountByBrandCategory = async () => {
    const {data} = await getProductPrePaidDiscountApi(props?.msn, isHindi);
    if (data.data) {
      dispatch(setProductPrePaidDiscountBrandCategory(props.msn, data.data));
    }
  };

  const getImageTitle = cpn => {
    let title =
      cpn &&
      cpn.block_data &&
      cpn.block_data.image_block &&
      cpn.block_data.image_block[0] &&
      cpn.block_data.image_block[0].image_title &&
      cpn.block_data.image_block[0].image_title;

    if (
      title &&
      title.includes('Get GST invoice and save up to 28% on business purchases')
    ) {
      return `${switchLanguage({
        isHindi: isHindi,
        keyName: 'emi_gst_text_part1',
      })} ${props.taxPercentage}% ${switchLanguage({
        isHindi: isHindi,
        keyName: 'emi_gst_text_part2',
      })}`;
    } else {
      return (
        cpn &&
        cpn.block_data &&
        cpn.block_data.image_block &&
        cpn.block_data.image_block[0] &&
        cpn.block_data.image_block[0].image_title
      );
    }
  };

  const renderMinCartValue = promoCode => {
    if (
      promoCode &&
      promoCode.promoDescription &&
      promoCode.promoDescription.includes('Min cart value')
    ) {
      let promoDescriptionArr = promoCode?.promoDescription?.split(' ');
      let promoDescriptionArrLength = promoDescriptionArr?.length;
      let minCartValue = promoDescriptionArr[promoDescriptionArrLength - 1];

      return `Min Cart Value  ₹${minCartValue}`;
    }
  };

  const togglePromoModal = () => {
    setPromoModal(!promoModal);
  };

  const adobePdpSpecificCoupon = () => {
    let obj = {
      'myapp.linkpagename': 'coupon on pdp clicked',
      'myapp.ctaname': 'coupon on pdp clicked',
      'myapp.channel': 'pdp',
      'myapp.subSection': 'pdp',
      '&&events': 'event9998',
    };
    trackStateAdobe('myapp.ctaclick', obj);
  };

  const adobeSeeMoreCouponClickd = () => {
    let obj = {
      'myapp.linkpagename': 'show more coupon on pdp clicked',
      'myapp.ctaname': 'show more coupon on pdp clicked',
      'myapp.channel': 'pdp',
      'myapp.subSection': 'pdp',
      '&&events': 'event9997',
    };
    trackStateAdobe('myapp.ctaclick', obj);
  };

  const getApplicablePromoCode = () => {
    if (applicablePromoCodeList?.applicablePromoCodeList?.length) {
      let remainingPromoList =
        applicablePromoCodeList?.applicablePromoCodeList?.slice(1);
      return (
        <>
          {(applicablePromoCodeList?.applicablePromoCodeList || []).map(
            (promo, promoKey) =>
              promoKey < 1 ? (
                <TouchableOpacity
                  onPress={adobePdpSpecificCoupon}
                  key={promoKey}
                  style={styles.couponOffer}>
                  <View
                    style={[
                      styles.row,
                      {alignItems: 'flex-start', width: '100%'},
                    ]}>
                    <Icon
                      name={'ticket-confirmation'}
                      size={22}
                      color={Colors.green2}
                    />
                    <View style={{marginLeft: Dimension.margin12}}>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'space-between',
                        }}>
                        <Text style={[styles.titletext, {width: '65%'}]}>
                          {switchLanguage({
                            isHindi: isHindi,
                            keyName: 'get',
                          })}{' '}
                          {promo.promoDescription}
                        </Text>
                        <View>
                          <TouchableOpacity
                            accessibilityLabel="copyCouponOnPDP"
                            // onPress={() => copyCoupon(promo.promoCode)}
                            // style={styles.coupon}

                            onPress={() =>
                              copyCoupon(
                                applicablePromoCodeList?.applicablePromoCodeList?.find(
                                  _ => _?.promoCode,
                                )?.promoCode,
                              )
                            }
                            style={
                              copied ? styles.copiedCoupon : styles.coupon
                            }>
                            <Text
                              style={
                                copied
                                  ? styles.whiteBoldOffTxt
                                  : styles.greenBoldOffTxt
                              }>
                              {
                                applicablePromoCodeList?.applicablePromoCodeList?.find(
                                  _ => _?.promoCode,
                                )?.promoCode
                              }
                            </Text>

                            {/* <Text style={styles.greenBoldOffTxt}>
                              {promo.promoCode}
                            </Text> */}
                          </TouchableOpacity>
                          <Text style={styles.tapToCopy}>
                            {!copied ? 'Tap to Copy' : 'Copied Coupon'}
                          </Text>
                          {/* <Text style={styles.tapToCopy}>Tap to Copy</Text> */}
                        </View>
                      </View>
                      {remainingPromoList && remainingPromoList.length ? (
                        <TouchableOpacity
                          accessibilityLabel="seeMoreCoupons"
                          onPress={() => {
                            togglePromoModal();
                            adobeSeeMoreCouponClickd();
                          }}>
                          <Text style={styles.seeMoreTxt}>
                            {switchLanguage({
                              isHindi: isHindi,
                              keyName: 'see_more_coupons',
                              promoLength: remainingPromoList.length,
                            })}{' '}
                          </Text>
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  </View>
                </TouchableOpacity>
              ) : null,
          )}
        </>
      );
    }
  };

  const onPressPrePaidDiscount = () => {
    let adobeData = {
      'myapp.linkpagename': 'prepaid coupon section on pdp clicked',
      'myapp.ctaname': 'prepaid coupon section on pdp clicked',
      'myapp.channel': 'pdp',
      'myapp.subSection': 'pdp',
      '&&events': 'event7989',
    };
    trackStateAdobe('myapp.ctaclick', adobeData);
  };

  const renderProductPrepaidDiscount = () => {
    if (Object.keys(productPrePaidDiscountData).length) {
      if (
        productPrePaidDiscountData?.minimumCartValue &&
        productPrePaidDiscountData?.absoluteDiscount
      ) {
        return (
          <TouchableOpacity
            accessibilityLabel="onPressPrePaidDiscount1"
            style={styles.couponOffer}
            onPress={onPressPrePaidDiscount}>
            <View style={styles.row}>
              <Image
                source={require('../../assets/images/best_deals.png')}
                style={{width: 20, height: 20}}></Image>
              <View style={styles.couponWrap}>
                <Text style={styles.greenBoldOffTxt}>
                  {switchLanguage({
                    isHindi: isHindi,
                    keyName: 'coupon_text1',
                    discount: productPrePaidDiscountData?.absoluteDiscount,
                  })}
                </Text>
                <Text style={styles.plighttxt}>
                  {switchLanguage({
                    isHindi: isHindi,
                    keyName: 'prepaid_discount_text',
                    discount: productPrePaidDiscountData?.absoluteDiscount,
                    brandName: productPrePaidDiscountData?.brandName,
                    categoryName: productPrePaidDiscountData?.categorName,
                    minimumCartValue:
                      productPrePaidDiscountData?.minimumCartValue,
                  })}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            accessibilityLabel="onPressPrePaidDiscount2"
            style={styles.couponOffer}
            onPress={onPressPrePaidDiscount}>
            <View style={styles.row}>
              <Image
                source={require('../../assets/images/best_deals.png')}
                style={{width: 20, height: 20}}></Image>
              <View style={styles.couponWrap}>
                <Text style={styles.greenBoldOffTxt}>
                  {switchLanguage({
                    isHindi: isHindi,
                    keyName: 'coupon_static_text',
                    productData: props?.productData,
                    discount: productPrePaidDiscountData?.percentageDiscount,
                  })}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        );
      }
    } else {
      return null;
    }
  };

  return (
    <>
      {couponsLoader ? (
        <ActivityIndicator size={'small'} color="red" />
      ) : showOffer ? (
        <View style={styles.shippingStripWrap}>
          <View style={{paddingHorizontal: Dimension.padding12}}>
            <SectionTitle
              Title={switchLanguage({
                isHindi: isHindi,
                keyName: 'offers_coupons',
              })}
            />
          </View>
          {renderProductPrepaidDiscount()}
          {getApplicablePromoCode()}
          {(offer.data || []).map((coupon, couponKey) => (
            <TouchableOpacity
              key={couponKey}
              onPress={() => props.couponAndOffersModal(coupon)}
              style={styles.couponOffer}>
              <View style={styles.row}>
                <Icon
                  name={'ticket-confirmation'}
                  size={22}
                  color={Colors.green2}
                />
                <View style={styles.couponWrap}>
                  <Text style={styles.titletext}>{getImageTitle(coupon)}</Text>
                </View>
              </View>
              <CustomeIcon
                name={'arrow_next'}
                size={24}
                color={'#000'}></CustomeIcon>
            </TouchableOpacity>
          ))}
        </View>
      ) : null}
      {promoModal && (
        <Modal
          overlayPointerEvents={'auto'}
          isVisible={promoModal}
          onTouchOutside={togglePromoModal}
          onDismiss={togglePromoModal}
          coverScreen={true}
          style={styles.modalbg}
          deviceWidth={deviceWidth}
          onBackButtonPress={togglePromoModal}
          onBackdropPress={togglePromoModal}>
          <View style={styles.modalInner}>
            <View style={styles.modalHeader}>
              <Text style={styles.headText}>{`All ${
                applicablePromoCodeList?.applicablePromoCodeList?.length - 1
              } Coupon(s)`}</Text>
              <TouchableOpacity onPress={togglePromoModal}>
                <Icon name="close-circle" size={22} color={'#3c3c3c'} />
              </TouchableOpacity>
            </View>
            {(applicablePromoCodeList?.applicablePromoCodeList || []).map(
              (promo, promoKey) =>
                promoKey == 0 ? null : (
                  <View key={promoKey} style={[styles.modalCoupenOffer]}>
                    <View
                      style={[
                        styles.row,
                        {
                          width: '100%',
                          flex: 1,
                        },
                      ]}>
                      <Icon
                        name={'ticket-confirmation'}
                        size={22}
                        color={Colors.green2}
                        style={{flex: 0.1}}
                      />
                      <View
                        style={{
                          flex: 0.6,
                        }}>
                        <Text style={[styles.titletext]}>
                          {switchLanguage({
                            isHindi: isHindi,
                            keyName: 'get',
                          })}{' '}
                          {promo.promoDescription}
                          {/* {promo.promoDescription?.split('|')?.[0] ||
                              promo.promoDescription} */}
                          {'\n'}
                          <Text style={styles.discriptionTxt}>
                            Min. cart value ₹{promo.minCartValue}
                          </Text>
                        </Text>
                        {/* </Text> */}
                      </View>
                      <View style={{flex: 0.3, alignSelf: 'center'}}>
                        <TouchableOpacity
                          onPress={() => {
                            copyCouponCode(promo.promoCode);
                          }}
                          style={
                            selectedCoupon == promo.promoCode && copiedCoupon
                              ? styles.copiedCoupon
                              : styles.coupon
                          }>
                          <Text
                            style={
                              selectedCoupon == promo.promoCode && copiedCoupon
                                ? styles.whiteBoldOffTxt
                                : styles.greenBoldOffTxt
                            }>
                            {/* <Text
                                style={
                                  selectedCoupon == promo.promoCode
                                    ? styles.whiteBoldOffTxt
                                    : styles.greenBoldOffTxt
                                }> */}
                            {promo.promoCode}
                          </Text>
                        </TouchableOpacity>
                        <Text style={styles.tapToCopy}>
                          {selectedCoupon != promo.promoCode
                            ? 'Tap to Copy'
                            : 'Copied Coupon'}
                        </Text>
                      </View>
                    </View>
                  </View>
                ),
            )}
          </View>
        </Modal>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  row: {flexDirection: 'row', alignItems: 'center'},
  shippingStripWrap: {
    // borderRadius: 8,
    backgroundColor: Colors.greenBG,
    // borderWidth: 1,
    // borderColor: Colors.BoldgreenText,
    paddingVertical: Dimension.padding12,
    marginTop: Dimension.margin10,
  },
  shippingStripText1: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    marginLeft: Dimension.margin12,
    alignSelf: 'center',
  },
  titletext: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomMediumFont,
    color: Colors.PrimaryTextColor,
  },
  SubTitletext: {
    fontSize: Dimension.font10,
    fontFamily: Dimension.CustomRegularFont,
    color: Colors.PrimaryTextColor,
  },
  couponOffer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: Dimension.margin8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.ProductBorderColor,
    alignItems: 'center',
    paddingHorizontal: Dimension.padding12,
  },
  couponWrap: {
    marginLeft: Dimension.margin12,
    width: '85%',
  },
  promoCode: {
    fontSize: Dimension.font14,
    color: '#299E22',
    fontFamily: Dimension.CustomBoldFont,
  },
  discriptionTxt: {
    fontSize: Dimension.font12,
    color: Colors.newgrayText,
    fontFamily: Dimension.CustomRegularFont,
  },
  discriptionTxtRupee: {
    fontSize: Dimension.font14,
    color: Colors.newgrayText,
    fontFamily: Dimension.CustomRobotoBold,
  },
  seeMoreTxt: {
    fontSize: Dimension.font12,
    color: '#278BED',
    fontFamily: Dimension.CustomMediumFont,
    // marginTop: Dimension.margin10,
  },
  modalbg: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    margin: 0,
    justifyContent: 'flex-end',
  },
  modalInner: {
    backgroundColor: '#F6FFF5',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingBottom: Dimension.padding40,
  },
  modalHeader: {
    padding: Dimension.padding15,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: 'space-between',
    paddingBottom: Dimension.padding10,
    backgroundColor: Colors.lightGreenBg,
  },
  headText: {
    fontSize: Dimension.font16,
    color: Colors.PrimaryTextColor,
    fontFamily: Dimension.CustomSemiBoldFont,
  },
  modalCoupenOffer: {
    marginHorizontal: Dimension.padding15,
    borderBottomColor: Colors.BoldgreenText,
    borderBottomWidth: 1,
    paddingVertical: Dimension.padding10,
    justifyContent: 'center',
    alignItems: 'center',
    alignContent: 'center',
    // marginTop: Dimension.margin10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  greenBoldOffTxt: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: '#2E9D22',
  },
  plighttxt: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
    color: Colors.PrimaryTextColor,
  },
  PboldTxt: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomBoldFont,
    color: Colors.PrimaryTextColor,
  },
  coupon: {
    paddingVertical: Dimension.padding4,
    paddingHorizontal: Dimension.padding14,
    backgroundColor: Colors.lightGreenBg,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: Dimension.borderRadius6,
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: Colors.BoldgreenText,
  },
  tapToCopy: {
    color: Colors.newgrayText,
    fontSize: Dimension.font10,
    alignSelf: 'center',
    fontFamily: Dimension.CustomRobotoRegular,
  },
  couponContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  whiteBoldOffTxt: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: '#fff',
    lineHeight: 18,
  },
  greenBoldOffTxt: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: '#2E9D22',
  },
  copiedCoupon: {
    paddingVertical: Dimension.padding4,
    paddingHorizontal: Dimension.padding18,
    backgroundColor: '#2E9D22',
    borderRadius: Dimension.borderRadius6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default React.memo(FreeShipping);
