import React from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import {applyThousandSeparator} from '../../generic';
import colors from '../../redux/constants/colors';
import Dimension from '../../redux/constants/dimensions';
import Colors from '../../redux/constants/colors';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import CustomeIcon from './CustomeIcon';

const CompareSimilarProducts = props => {
  const {item} = props;

  let headers = Object.keys(item?.[0]?.attributeToCompare)?.map(_ => ({
    key: _,
    label: _?.charAt(0).toUpperCase() + _?.slice(1),
  }));

  console.log(
    props?.compareAddCartLoader &&
      item?.[0]?.moglixPartNumber == props?.compareAddCartMsn,
  );

  return (
    <View style={{backgroundColor: '#fff', paddingBottom: Dimension.padding10}}>
      <Text style={styles.mainTitle}>Similar Products To Compare</Text>
      <View
        style={{
          flexDirection: 'row',
        }}>
        <View
          style={{
            justifyContent: 'flex-end',
          }}>
          <Text
            style={[
              styles.attributeTxtConstant,
              styles.attributeTxtOdd,
              {
                borderTopWidth: 1,
                borderTopColor: colors.ProductBorderColor,
              },
            ]}>
            Rating
          </Text>
          <Text
            style={[
              styles.attributeTxtConstant,
              {backgroundColor: 'transparent'},
            ]}>
            Brand
          </Text>
          {headers.map((_, k) => (
            <Text
              key={k}
              style={[
                styles.attributeTxtConstant,
                (k + 3) % 2 !== 0 && styles.attributeTxtOdd,
              ]}>
              {_.label}
            </Text>
          ))}
        </View>
        <ScrollView horizontal={true}>
          {item?.reverse().map((_, k) => (
            <View key={k}>
              <TouchableOpacity
                style={
                  k == 0
                    ? styles.parentViewCurrentArticle
                    : styles.parentViewArticle
                }
                onPress={() =>
                  props.navigation.push('Product', {
                    msn: _?.moglixPartNumber,
                  })
                }>
                {/* {k == 0 ? (
                  <View style={styles.tagStyle}>
                    <Text style={styles.tagTxt}>Current</Text>
                  </View>
                ) : null} */}
                <View>
                  <Image
                    source={{
                      uri:
                        'https://cdn.moglix.com/' + _?.imageWebp ||
                        _?.imageLink ||
                        _?.mainImageLink ||
                        _?.imageLink_medium ||
                        _?.imageLink_small,
                    }}
                    style={{
                      borderRadius: Dimension.borderRadius4,
                      height: 124,
                      marginBottom: Dimension.margin12,
                    }}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.rightArea}>
                  <Text
                    style={[
                      styles.prodNameLight,
                      {color: k === 0 ? colors.black : '#278BED'},
                    ]}>
                    {_?.productName.slice(0, 40) + '...'}
                  </Text>
                  <View style={styles.mainPriceWrap}>
                    <Text style={styles.mainPrice}>
                      ₹ {applyThousandSeparator(_?.salesPrice)}
                    </Text>
                  </View>
                </View>
                <View style={styles.BtnWrap}>
                  <View style={styles.cartBtnTextForGrid}>
                    <Pressable
                      style={styles.cartBtnPress}
                      disabled={props?.compareAddCartLoader}
                      onPress={e => {
                        props?.addTocartFromPDP(_, 'compare');
                      }}
                      android_ripple={{color: '#D9232D', borderless: true}}>
                      {props?.compareAddCartLoader &&
                      _?.moglixPartNumber == props?.compareAddCartMsn ? (
                        <ActivityIndicator
                          size={'small'}
                          color={colors.RedThemeColor}
                        />
                      ) : (
                        <Text style={styles.cartBtnText}>
                          <CustomeIcon
                            name={'cart2'}
                            color={Colors.RedThemeColor}
                            size={Dimension.font20}></CustomeIcon>
                        </Text>
                      )}
                    </Pressable>
                  </View>

                  <Pressable
                    disabled={props?.compareBuyNowLoader}
                    style={styles.BuyNowBtn}
                    onPress={() => {
                      props.buyNowFromPDP(_, 'compare');
                    }}
                    android_ripple={{color: '#fff', borderless: true}}>
                    {props?.compareBuyNowLoader &&
                    _?.moglixPartNumber == props?.compareAddCartMsn ? (
                      <ActivityIndicator
                        color={'#fff'}
                        size={'small'}
                        style={styles.cartLoader}
                      />
                    ) : null}
                    <Text style={styles.buyNowTxt}>Buy Now</Text>
                  </Pressable>
                </View>
              </TouchableOpacity>
              <View
                style={[
                  k == 0 ? styles.featuresCurrentView : styles.featuresView,
                  {marginTop: 'auto'},
                ]}>
                <View
                  style={[
                    styles.rateProd,
                    {backgroundColor: k === 0 ? 'transparent' : '#F9F9FB'},
                    {
                      paddingLeft:
                        k === 0 ? Dimension.padding15 : Dimension.padding25,
                    },
                  ]}>
                  {_?.avgRating > 3.5 ? (
                    <View style={styles.prodRating}>
                      <Text style={styles.ratingCount}>
                        {_?.avgRating?.toFixed(1)}
                      </Text>
                      <FAIcon name="star" style={styles.starIcon} />
                    </View>
                  ) : (
                    <Text
                      style={{
                        fontSize: Dimension.font12,
                        fontFamily: Dimension.CustomRegularFont,
                        paddingVertical: Dimension.padding2,
                      }}>
                      -
                    </Text>
                  )}
                  {!!_?.reviewCount ? (
                    <Text style={styles.reviewCount}>
                      ({_?.reviewCount} Reviews)
                    </Text>
                  ) : null}
                </View>
                <Text
                  style={[
                    styles.attributeTxtDynamic,
                    {
                      paddingLeft:
                        k === 0 ? Dimension.padding15 : Dimension.padding25,
                    },
                  ]}>
                  {_?.brandName}
                </Text>
                {headers?.map((__, k1) => (
                  <Text
                    key={k1}
                    style={[
                      styles.attributeTxtDynamic,
                      k !== 0 && (k1 + 3) % 2 !== 0
                        ? styles.attributeTxtOdd
                        : styles.attributeTxtNotCurrent,
                      {
                        paddingLeft:
                          k === 0 ? Dimension.padding15 : Dimension.padding25,
                      },
                    ]}>
                    {_?.attributeToCompare?.[__?.key]}
                  </Text>
                ))}
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  mainTitle: {
    color: '#3C3C3C',
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomSemiBoldFont,
    padding: Dimension.padding15,
  },
  prodName: {
    color: Colors.PrimaryTextColor,
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomSemiBoldFont,
  },

  prodNameLight: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomRegularFont,
    lineHeight: 18,
    // maxHeight: 60,
  },

  leftProdImage: {
    width: Dimension.width100,
    height: Dimension.width100,
    marginBottom: 10,
    alignSelf: 'center',
  },

  prodRating: {
    flexDirection: 'row',
    backgroundColor: Colors.ratingColor,
    borderRadius: Dimension.borderRadius4,
    paddingHorizontal: Dimension.padding6,
    paddingVertical: Dimension.padding2,
    alignItems: 'center',
  },

  ratingCount: {
    color: '#fff',
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomRegularFont,
  },

  starIcon: {color: '#fff', fontSize: Dimension.font8, marginLeft: 3},

  reviewCount: {
    marginLeft: 5,
    color: Colors.newgrayText,
    fontSize: Dimension.font12,
    alignSelf: 'center',
  },

  CardWrap: {
    width: Dimension.HomeBestSellerCardWidth,
    borderWidth: 1,
    borderColor: Colors.ProductBorderColor,
    backgroundColor: Colors.white,
    borderRadius: Dimension.borderRadius8,
  },

  offPrice: {
    fontSize: Dimension.font12,
    color: Colors.newgrayText,
    fontFamily: Dimension.CustomRobotoRegular,
    marginTop: -2,
    textDecorationLine: 'line-through',
  },
  price: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Dimension.margin5,
  },
  mainPriceWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Dimension.margin5,
  },
  mainPrice: {
    fontSize: Dimension.font16,
    fontFamily: Dimension.CustomRobotoBold,
    color: Colors.PrimaryTextColor,
    lineHeight: Dimension.padding18,
    marginTop: Dimension.margin5,
  },

  mainPriceGray: {
    fontSize: Dimension.font20,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: '#3C3C3C',
  },
  parentViewArticle: {
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: Dimension.padding10,
    // marginBottom: Dimension.margin12
    width: Dimensions.get('window').width * 0.4,
    borderWidth: Dimension.borderwidth1,
    borderColor: colors.ProductBorderColor,
    marginLeft: Dimension.margin10,
  },
  parentViewCurrentArticle: {
    backgroundColor: '#FBE8E9',
    padding: Dimension.padding10,
    width: Dimensions.get('window').width * 0.4,
    borderWidth: Dimension.borderwidth1,
    borderColor: colors.ProductBorderColor,
    borderTopLeftRadius: 8,
    borderTopRightRadius: 8,
    paddingBottom: Dimension.padding15,
  },
  featuresView: {
    backgroundColor: '#fff',
  },
  featuresCurrentView: {backgroundColor: '#FBE8E9'},

  rateProd: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: colors.ProductBorderColor,
    borderBottomWidth: 1,
    borderBottomColor: colors.ProductBorderColor,
    paddingVertical: Dimension.padding3,
  },
  BtnWrap: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  cartBtnTextForGrid: {
    backgroundColor: Colors.white,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: Dimension.borderRadius6,
    borderWidth: 1,
    borderColor: Colors.RedThemeColor,
    flexDirection: 'row',
    marginRight: Dimension.margin10,
  },
  cartBtnPress: {
    paddingHorizontal: Dimension.padding8,
    paddingVertical: Dimension.padding6,
  },
  BuyNowBtn: {
    backgroundColor: Colors.RedThemeColor,
    paddingHorizontal: Dimension.padding5,
    paddingTop: Dimension.padding9,
    paddingBottom: Dimension.padding8,
    borderRadius: Dimension.borderRadius6,
    flex: 1,
    //marginTop: -Dimension.margin10,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  buyNowTxt: {
    fontSize: Dimension.font12,
    color: Colors.white,
    fontFamily: Dimension.CustomBoldFont,
    textTransform: 'uppercase',
  },
  cartBtnText: {
    fontSize: Dimension.font12,
    fontFamily: Dimension.CustomSemiBoldFont,
    color: '#fff',
  },
  cartLoader: {
    marginLeft: Dimension.margin5,
    // backgroundColor:'red',
    height: Dimension.height11,
  },
  tagStyle: {
    backgroundColor: '#979797',
  },
  tagTxt: {color: '#FFFFFF'},
  attributeTxtConstant: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomRegularFont,
    paddingVertical: Dimension.padding2,
    borderBottomWidth: 1,
    borderBottomColor: colors.ProductBorderColor,
    borderRightWidth: 1,
    borderRightColor: colors.ProductBorderColor,
    paddingHorizontal: Dimension.padding15,
  },
  attributeTxtDynamic: {
    fontSize: Dimension.font14,
    fontFamily: Dimension.CustomRegularFont,
    paddingVertical: Dimension.padding2,
    borderBottomWidth: 1,
    borderBottomColor: colors.ProductBorderColor,
  },
  attributeTxtOdd: {
    color: colors.LightTextColor,
    backgroundColor: '#F9F9FB',
  },
  attributeTxtNotCurrent: {
    color: colors.LightTextColor,
    backgroundColor: 'transparent',
  },
});
export default CompareSimilarProducts;
