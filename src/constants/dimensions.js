import {Dimensions, Platform, PixelRatio} from 'react-native';

const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');

// based on iphone 5s's scale
const scale = SCREEN_WIDTH / 320;

const normalize = size => {
  const newSize = size * scale;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};
const scale1 = SCREEN_WIDTH / 360;
export const normalizeforFont = size => {
  const newSize = size * scale1;
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};

const Dimension = {
  font6: normalizeforFont(6),
  font8: normalizeforFont(8),
  font9: normalizeforFont(9),
  font10: normalizeforFont(10),
  font11: normalizeforFont(11),
  font12: normalizeforFont(12),
  font13: normalizeforFont(13),
  font14: normalizeforFont(14),
  font16: normalizeforFont(16),
  font15: normalizeforFont(15),
  font18: normalizeforFont(18),
  font20: normalizeforFont(20),
  font22: normalizeforFont(22),
  font24: normalizeforFont(24),
  font26: normalizeforFont(26),
  font28: normalizeforFont(28),
  font30: normalizeforFont(30),
  font34: normalizeforFont(34),
  font36: normalizeforFont(36),
  font44: normalizeforFont(44),

  CustomBlackFont: Platform.OS == 'ios' ? 'Poppins' : 'Poppins-Black',
  CustomBoldFont: Platform.OS == 'ios' ? 'Poppins-SemiBold' : 'Poppins-Bold',
  CustomExtraBoldFont:
    Platform.OS == 'ios' ? 'Poppins-SemiBold' : 'Poppins-ExtraBold',
  CustomExtraLightFont: Platform.OS == 'ios' ? 'Poppins' : 'Poppins-ExtraLight',
  CustomLightFont: Platform.OS == 'ios' ? 'Poppins' : 'Poppins-Light',
  CustomMediumFont: Platform.OS == 'ios' ? 'Poppins-Medium' : 'Poppins-Medium',
  CustomRegularFont:
    Platform.OS == 'ios' ? 'Poppins-Medium' : 'Poppins-Regular',
  CustomSemiBoldFont:
    Platform.OS == 'ios' ? 'Poppins-SemiBold' : 'Poppins-SemiBold',
  CustomSemThinFont: Platform.OS == 'ios' ? 'Poppins' : 'Poppins-Thin',
  CustomRobotoBold: Platform.OS == 'ios' ? 'Roboto' : 'Roboto-Bold',
  CustomRobotoRegular: Platform.OS == 'ios' ? 'Roboto' : 'Roboto-Regular',

  margin1: normalize(1),
  margin2: normalize(2),
  margin3: normalize(3),
  margin4: normalize(4),
  margin5: normalize(5),
  margin6: normalize(6),
  margin7: normalize(7),
  margin8: normalize(8),
  margin10: normalize(10),
  margin11: normalize(11),
  margin12: normalize(12),
  margin13: normalize(13),
  margin14: normalize(14),
  margin15: normalize(15),
  margin16: normalize(16),
  margin17: normalize(17),
  margin18: normalize(18),
  margin20: normalize(20),
  margin22: normalize(22),
  margin24: normalize(24),
  margin30: normalize(30),
  margin32: normalize(32),
  margin33: normalize(33),
  margin35: normalize(35),
  margin40: normalize(40),
  margin60: normalize(60),
  margin25: normalize(25),
  margin28: normalize(28),
  margin40: normalize(40),
  margin50: normalize(50),
  margin60: normalize(60),
  margin70: normalize(70),
  margin75: normalize(75),
  margin100: normalize(100),
  margin120: normalize(120),
  margin130: normalize(130),
  margin150: normalize(150),
  margin160: normalize(160),
  margin170: normalize(170),
  margin180: normalize(180),
  margin200: normalize(200),

  height5: normalize(5),
  height10: normalize(10),
  height11: normalize(11),
  height15: normalize(15),
  height16: normalize(16),
  height18: normalize(18),
  height20: normalize(20),
  height24: normalize(24),
  height25: normalize(25),
  height28: normalize(28),
  height27: normalize(27),
  height29: normalize(29),
  height30: normalize(30),
  height34: normalize(34),
  height36: normalize(36),
  height40: normalize(40),
  height42: normalize(42),
  height45: normalize(45),
  height48: normalize(48),
  height50: normalize(50),
  height55: normalize(55),
  height60: normalize(60),
  height65: normalize(65),
  height70: normalize(70),
  height71: normalize(71),
  height74: normalize(74),
  height80: normalize(80),
  height90: normalize(90),
  height96: normalize(96),
  height100: normalize(100),
  height125: normalize(125),
  height130: normalize(130),
  height142: normalize(142),
  height145: normalize(145),
  height160: normalize(160),
  height150: normalize(150),
  height100: normalize(100),
  height170: normalize(170),
  height180: normalize(180),
  height200: normalize(200),
  height250: normalize(250),
  height245: normalize(245),
  height260: normalize(260),
  height270: normalize(270),
  height275: normalize(275),
  height280: normalize(280),
  height290: normalize(290),

  height221: normalize(221),
  height218: normalize(218),
  height328: normalize(328),

  padding2: normalize(2),
  padding3: normalize(3),
  padding4: normalize(4),
  padding5: normalize(5),
  padding6: normalize(6),
  padding8: normalize(8),
  padding9: normalize(9),
  padding10: normalize(10),
  padding12: normalize(12),
  padding13: normalize(13),
  padding14: normalize(14),
  padding15: normalize(15),
  padding16: normalize(16),
  padding18: normalize(18),
  padding19: normalize(19),
  padding20: normalize(20),
  padding28: normalize(28),
  padding25: normalize(25),
  padding32: normalize(32),
  padding34: normalize(34),
  padding35: normalize(35),
  padding30: normalize(30),
  padding40: normalize(40),
  padding45: normalize(45),
  padding50: normalize(50),
  padding55: normalize(55),
  padding80: normalize(80),

  width50: normalize(50),
  width55: normalize(55),

  width58: normalize(58),
  width65: normalize(65),
  width60: normalize(60),
  width70: normalize(70),
  width74: normalize(74),
  width75: normalize(75),
  width80: normalize(80),
  width82: normalize(82),
  width85: normalize(85),
  width95: normalize(95),
  width98: normalize(98),
  width90: normalize(90),
  width100: normalize(100),
  width105: normalize(105),
  width110: normalize(110),
  width130: normalize(130),
  width135: normalize(135),
  width140: normalize(140),
  width141: normalize(143),
  width150: normalize(150),
  width160: normalize(160),
  width170: normalize(170),
  width175: normalize(175),
  width180: normalize(180),
  width185: normalize(185),
  width200: normalize(200),
  width215: normalize(215),
  width205: normalize(205),
  width145: normalize(145),
  width115: normalize(115),
  width120: normalize(120),
  width125: normalize(125),
  width227: normalize(227),
  width224: normalize(224),
  width240: normalize(240),
  width245: normalize(245),
  width250: normalize(250),
  width330: normalize(330),
  width300: normalize(300),
  width22: normalize(24),
  width24: normalize(20),
  width25: normalize(25),
  width32: normalize(32),
  width42: normalize(42),
  width52: normalize(52),
  width10: normalize(10),
  width8: normalize(8),
  width5: normalize(5),
  width12: normalize(12),
  width14: normalize(14),
  width16: normalize(16),
  width18: normalize(18),
  width20: normalize(20),
  width26: normalize(28),
  width38: normalize(38),
  width36: normalize(36),
  width30: normalize(30),
  width40: normalize(40),
  width45: normalize(45),
  width74: normalize(74),
  width150: normalize(150),
  width298: normalize(298),
  width294: normalize(290),

  BestSellerCardWidth: normalize(145),
  HomeBestSellerCardWidth: normalize(145),
  BestSellerPrdImg: normalize(115),
  HomePageBannerHeight: normalize(300),
  HomePageBannerHeightFull2: normalize(170),
  HomePageQuarterWidthBannerHeight: normalize(70),

  //HomePageBannerHeight:normalize(326),

  // sliderImagewidth:'100%',
  HomePageHalfWidthBannerHeight: normalize(120),

  prdListViewImage: normalize(65),
  plpListViewImage: normalize(100),
  plpListViewImageHeight: normalize(100),
  plpListViewImageHeightWithoutEmi: normalize(80),
  heightforCaurosal: normalize(170),
  heightforhomeBannerCarousal: normalize(110),
  relvantCatimgheight: normalize(100),
  borderwidth1: 1,
  borderRadius3: normalize(3),
  borderRadius4: normalize(4),
  borderRadius6: normalize(6),
  borderRadius7: normalize(7),
  borderRadius8: normalize(8),
  borderRadius10: normalize(10),
  borderRadius12: normalize(12),
  borderRadius16: normalize(16),
  borderRadius20: normalize(20),
  borderRadius30: normalize(30),
  SCREEN_WIDTH,
  SCREEN_HEIGHT,
};

export default Dimension;
