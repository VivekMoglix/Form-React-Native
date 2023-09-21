import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import {
  Text,
  View,
  TextInput,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
  Image,
  Picker,
  Platform,
} from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import Mapmyindia from 'mapmyindia-restapi-react-native-beta';
import {check, request, PERMISSIONS, RESULTS} from 'react-native-permissions';
import Header from '../../components/Common/Header';
import {updateAddressByInvoiceType} from '../../redux/actions/address';
import {validateGstin, validatePincode} from '../../services/address';
import {
  States,
  gstinRegex,
  addressLineRegex,
  addressCustomerNameregex,
  spaceRegex,
  phoneNumberRegex,
} from '../../constants';
import {STATE_STATUS} from '../../redux/constants';
import UpdateAddressModal from '../../components/Common/UpdateAddressModal';
import styles from './style';
import FloatingLabelInputField from '../../components/Common/FloatingInput';
import Dimension from '../../redux/constants/dimensions';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import OTPModal from '../../components/Common/OTPModal';
import Toast from 'react-native-toast-message';
import {trackStateAdobe} from '../../services/analytics';
import {getCustomerBusinessDetailsApi} from '../../services/user';
import VerifyPhoneModal from '../../components/Common/VerifyPhoneModal';
import colors from '../../redux/constants/colors';
import IOSPicker from 'react-native-ios-picker';

Mapmyindia.setRestApiKey('98a7e6d5c704325cfebc32cf85bdbe41');
Mapmyindia.setClientId(
  '33OkryzDZsKzwOvjcXKcEBfG5Jva-E7nATVU0kt_Sftv1gXNCYF1fOXa5hQIcg3tl6M13p5oBZhwDxtIsU4d3A==',
);
Mapmyindia.setClientSecret(
  'lrFxI-iSEg8cMPOai6_qmoyCQc93T1jX_6izZt5Dbp_QKJmZG9OISG6hfiHB4vep4DY2OeoyNPHt3VJYxQKITDK2r2pJ444Z',
);
const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
const pincodeRegex = /^[0-9]{6}$/;
const phoneRegex = '^[1-9][0-9]{9}$';

const UpdateAddressScreen = props => {
  const addresses = useSelector(state => state.addressReducer || {});
  const sessionId = useSelector(
    state => ((state.authReducer || {}).data || {}).sessionId || '',
  );
  const token = useSelector(
    state => ((state.authReducer || {}).data || {}).token || '',
  );
  const userId = useSelector(
    state => ((state.authReducer || {}).data || {}).userId || '',
  );
  const itemsList = useSelector(
    state => ((state.cartReducer || {}).data || {}).itemsList || [],
  );
  const currActiveShippingId = useSelector(
    state => (state.addressReducer || {}).currActiveShippingId || null,
  );

  const user = useSelector(state => (state.authReducer || {}).data || {});
  const cart = useSelector(state => (state.cartReducer || {}).data || {});
  const {title, address, invoiceType} = props.route.params;
  const [tempAddress, setTempAddress] = useState({});
  const [updateAddressModal, setUpdateAddressModal] = useState(false);
  const [loader, setLoader] = useState(false);
  const [init, setInit] = useState(false);
  const [gstin, setGstin] = useState(address.gstin || '');
  const [gstinVerified, setGstinVerified] = useState(
    address.gstinVerified || '',
  );
  const [name, setName] = useState(
    address.addressCustomerName && address.addressCustomerName == 'User'
      ? ''
      : address.addressCustomerName && address.addressCustomerName !== 'User'
      ? address.addressCustomerName
      : user.userName && user.userName == 'User'
      ? ''
      : user.userName && user.userName !== 'User'
      ? user.userName
      : '',
  );

  const [email, setEmail] = useState(address.email || user.email || '');
  const [phone, setPhone] = useState(address.phone || user.phone || '');
  const [alternatePhone, setAlternatePhone] = useState(
    address.alternatePhone || user.alternatePhone || '',
  );
  const [addressLine, setAddressLine] = useState(
    (address.addressLine && address.addressLine.split('|')[1].trim()) || '',
  );
  const [country, setCountry] = useState(
    address.country || {idCountry: 110, isoCode: 'IN', name: 'INDIA'},
  );
  const [stateName, setStateName] = useState(address.state || '');
  const [area, setArea] = useState(
    (address.addressLine && address.addressLine.split('|')[0].trim()) || '',
  );
  const [verifyPhoneModal, setVerifyPhoneModal] = useState(false);
  const [city, setCity] = useState(address.city || '');
  const [landmark, setLandmark] = useState(address.landmark);
  const [postCode, setPostCode] = useState(address.postCode || '');
  const [gstinError, setGstinError] = useState(false);
  const [nameError, setNameError] = useState(false);
  const [emailError, setEmailError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);
  const [alternatePhoneError, setAlternatePhoneError] = useState(false);
  const [addressLineError, setAddressLineError] = useState(false);
  const [countryError, setCountryError] = useState(false);
  const [stateNameError, setStateNameError] = useState(false);
  const [areaError, setAreaError] = useState(false);
  const [cityError, setCityError] = useState(false);
  const [landmarkError, setLandmarkError] = useState(false);
  const [postCodeError, setPostCodeError] = useState(false);
  const [pinMaperror, setpinMaperror] = useState('');
  const [otpModal, setOTPModal] = useState(false);
  const [usedGetLocation, setUsedGetLocation] = useState(false);
  const [cityList, setCityList] = useState([]);
  const [isKeyboardVisible, setKeyboardVisible] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    setInit(true);
    if (title == 'Billing Address') {
      getBusinessData();
    }
    if (address && address.city) {
      getcityData();
    }
  }, []);

  //handle keyboard
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      () => {
        setKeyboardVisible(true); // or some other action
      },
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false); // or some other action
      },
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  const getcityData = async () => {
    if (postCode && sessionId && token) {
      const {data} = await validatePincode(postCode, sessionId, token);
      setCityList(data.dataList);
    }
  };

  const getBusinessData = async () => {
    try {
      const {data} = await getCustomerBusinessDetailsApi(
        userId,
        sessionId,
        token,
      );
      if (data.data && data.data.gstinVerified) {
        setGstin(address.gstin || data.data.gstin);
        setPhone(address.phone || data.data.phone);
        setName(address.addressCustomerName || data.data.companyName);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (loader && addresses[invoiceType].status === STATE_STATUS.FETCHED) {
      setLoader(false);
      props.navigation.goBack();
    }
  });

  useEffect(() => {
    if (init) {
      if (gstin && gstin.length > 14 && gstin.match(gstinRegex)) {
        setGstinError(false);
      } else {
        setGstinError(true);
        setGstinVerified(false);
      }
    }
  }, [gstin]);

  const atLeastOneLetterAndSpace = str => {
    return /^[A-Za-z\s]*$/.test(str) && /[A-Za-z]/.test(str);
  };

  const newAddressLineRegex = str => {
    return /[A-Za-z]/.test(str);
  };

  useEffect(() => {
    if (init) {
      if (name && name.length && atLeastOneLetterAndSpace(name)) {
        setNameError(false);
      } else {
        setNameError(true);
      }
    }
  }, [name]);

  // useEffect(() => {
  //   if (init) {
  //     if (email && email.length && email.match(emailRegex)) {
  //       setEmailError(false);
  //     } else if (email && email.length && !email.match(emailRegex)) {
  //       setEmailError(true);
  //     } else {
  //       setEmailError(false);
  //     }
  //   }
  // }, [email]);

  useEffect(() => {
    if (init) {
      if (email && email.length && email.match(emailRegex)) {
        setEmailError(false);
      } else {
        setEmailError(true);
      }
    }
  }, [email]);

  useEffect(() => {
    if (init) {
      if (phone && phone.length > 9 && phone.match(phoneNumberRegex)) {
        setPhoneError(false);
      } else {
        setPhoneError(true);
      }
    }
  }, [phone]);

  useEffect(() => {
    if (init) {
      if (!alternatePhone || alternatePhone.length > 9) {
        setAlternatePhoneError(false);
      } else {
        setAlternatePhoneError(true);
      }
    }
  }, [alternatePhone]);

  useEffect(() => {
    if (init) {
      if (area && area.length > 1) {
        setAreaError(false);
      } else {
        setAreaError(true);
      }
    }
  }, [area]);

  useEffect(() => {
    if (init) {
      if (
        addressLine &&
        addressLine.length &&
        addressLine.replace('|', ',').match(addressLineRegex) &&
        newAddressLineRegex(addressLine)
      ) {
        setAddressLineError(false);
      } else {
        setAddressLineError(true);
      }
    }
  }, [addressLine]);

  useEffect(() => {
    if (init) {
      if (stateName && stateName.idState && stateName.name) {
        setStateNameError(false);
      } else {
        setStateNameError(true);
      }
    }
  }, [stateName]);

  useEffect(() => {
    if (init) {
      if (city && city.length > 2) {
        setCityError(false);
      } else {
        setCityError(true);
      }
    }
  }, [city]);

  useEffect(() => {
    console.log(postCode && postCode.length > 5 && pincodeRegex.test(postCode));
    if (init) {
      if (postCode && postCode.length > 5 && pincodeRegex.test(postCode)) {
        setPostCodeError(false);
      } else {
        setPostCodeError(true);
      }
    }
  }, [postCode]);

  const billingAddresses = [
    {
      title: 'GST No.*',
      state: gstin,
      disabled: false,
      onChange: text => setGstin(text),
      maxLength: 15,
      errorState: gstinError,
      style: {width: '100%'},
      errorText: ' Kindly enter a valid GSTIN of 15-digit ',
      extra: () => (
        <TouchableOpacity
          accessibilityLabel="OnEnterGst"
          onPress={onEnterGstin}
          disabled={gstinVerified}
          style={[
            styles.gstBtn,
            {
              backgroundColor:
                gstinVerified && !gstinError ? '#299E22' : '#D9232D',
            },
          ]}>
          <Text style={styles.gstText}>
            {gstinVerified ? 'VERIFIED' : 'VERIFY NOW'}
          </Text>
        </TouchableOpacity>
      ),
    },
    {
      title: 'Business Name*',
      state: name,
      disabled: false,
      onChange: text => setName(text),
      errorState: nameError,
      style: {width: '100%'},
      errorText: 'Kindly enter your business entity name',
    },
    {
      title: 'Business Email ID*',
      state: email,
      disabled: false,
      onChange: text => setEmail(text),
      errorState: emailError,
      style: {width: '100%'},
      errorText: 'Kindly enter valid business email',
    },
    {
      title: 'Business Phone Number*',
      state: phone,
      disabled: false,
      onChange: text => setPhone(text),
      keyboardType: 'number-pad',
      style: {width: '100%'},
      errorState: phoneError,
      errorText: 'Kindly enter valid phone number',
      maxLength: 10,
    },
    {
      title: 'Pincode*',
      state: postCode,
      disabled: false,
      style: {width: '100%'},
      onChange: text => setPostCode(text),
      keyboardType: 'number-pad',
      errorState: pinMaperror || postCodeError,
      errorText: pinMaperror || 'Kindly enter your valid pincode',
      maxLength: 6,
    },
    {
      title: 'City*',
      state: city,
      disabled: false,
      style: {width: '48%'},
      onChange: text => setCity(text),
      errorState: cityError,
      errorText: 'Kindly select valid city',
    },
    {
      title: 'State*',
      state: stateName.name,
      disabled: true,
      style: {width: '48%'},
      onChange: text => setStateName(text),
      errorState: stateNameError,
      errorText: 'Kindly enter valid state',
    },
    {
      title: 'Country*',
      state: country.name,
      disabled: true,
      style: {width: '100%'},
      onChange: text => setCountry(text),
      errorState: countryError,
      errorText: 'Kindly enter your country',
    },
    {
      title: 'Flat, House No., Building, Company*',
      state: area,
      disabled: false,
      style: {width: '100%'},
      onChange: text => setArea(text),
      errorState: areaError,
      errorText: 'Kindly enter your flat, house no',
    },
    {
      title: 'Area, Colony, Street, Sector, Village *',
      state: addressLine,
      disabled: false,
      style: {width: '100%'},
      onChange: text => setAddressLine(text),
      errorState: addressLineError,
      errorText: 'Kindly enter your address',
    },
    {
      title: 'Landmark (Optional)',
      state: landmark,
      disabled: false,
      style: {width: '100%'},
      onChange: text => setLandmark(text),
      errorState: landmarkError,
      errorText: 'Kindly enter valid landmark',
    },
  ];

  const shippingAddresses = [
    {
      title: 'Full Name*',
      state: name,
      disabled: false,
      onChange: text => setName(text),
      errorState: nameError,
      errorText: 'Kindly enter your name',
      style: {width: '100%'},
    },
    {
      title: 'Email ID*',
      state: email,
      disabled: false,
      onChange: text => setEmail(text),
      errorState: emailError,
      errorText: 'Kindly enter valid email',
      style: {width: '100%'},
    },
    {
      title: 'Phone Number*',
      state: phone,
      disabled: false,
      onChange: text => setPhone(text),
      keyboardType: 'number-pad',
      errorState: phoneError,
      errorText: 'Kindly enter valid phone number',
      maxLength: 10,
      style: {width: '100%'},
      extra: () =>
        isPhoneVerified() ? (
          <MaterialCommunityIcon
            color={colors.GreenColor}
            size={20}
            style={{position: 'absolute', right: 6, top: 34, zIndex: 5}}
            name={'check-circle-outline'}
          />
        ) : null,
    },
    {
      title: 'Alternate Phone Number (Optional)',
      state: alternatePhone,
      disabled: false,
      onChange: text => setAlternatePhone(text),
      keyboardType: 'number-pad',
      errorState: alternatePhoneError,
      errorText: 'Kindly enter valid phone number',
      maxLength: 10,
      style: {width: '100%'},
    },
    {
      component: () => (
        <TouchableOpacity
          accessibilityLabel="GetLocation"
          onPress={getLocation}
          style={styles.useMyLocBtn}>
          <MatIcon
            name={'my-location'}
            style={styles.locIcon}
            size={24}
            color={'#fff'}
          />
          <Text style={styles.useMyLocText}>USE MY LOCATION</Text>
        </TouchableOpacity>
      ),
    },
    {
      title: 'Pincode*',
      state: postCode,
      disabled: false,
      onChange: text => onSetPincode(text),
      keyboardType: 'number-pad',
      errorState: postCodeError,
      errorText: 'Kindly enter your valid pincode',
      maxLength: 6,
      style: {width: '48%'},
    },
    {
      title: 'City/District/Town*',
      state: city,
      disabled: true,
      onChange: text => setCity(text),
      errorState: cityError,
      errorText: 'Kindly select valid city',
      style: {width: '48%'},
    },
    {
      title: 'State*',
      state: stateName.name,
      disabled: true,
      onChange: text => setStateName(text),
      errorState: stateNameError,
      errorText: 'Kindly enter valid state',
      style: {width: '48%'},
    },
    {
      title: 'Flat, House No., Building, Company*',
      state: area,
      disabled: false,
      style: {width: '100%'},
      onChange: text => setArea(text),
      errorState: areaError,
      errorText: 'Kindly enter your flat, house no',
    },
    {
      title: 'Area, Colony, Street, Sector, Village*',
      state: addressLine,
      disabled: false,
      style: {width: '100%'},
      onChange: text => setAddressLine(text),
      errorState: addressLineError,
      errorText: 'Kindly enter your address',
    },
    {
      title: 'Country*',
      state: country.name,
      disabled: true,
      onChange: text => setCountry(text),
      errorState: countryError,
      errorText: 'Kindly enter your country',
      style: {width: '100%'},
    },

    {
      title: 'Landmark (Optional)',
      state: landmark,
      disabled: false,
      onChange: text => setLandmark(text),
      errorState: landmarkError,
      errorText: 'Kindly enter valid landmark',
      style: {width: '100%'},
    },
  ];

  const onSetPincode = async pincode => {
    try {
      setpinMaperror(false);
      setPostCode(pincode);
      if (
        pincode &&
        pincode.length > 5 &&
        sessionId &&
        token &&
        pincodeRegex.test(pincode)
      ) {
        setPostCodeError(false);
        const {data} = await validatePincode(pincode, sessionId, token);
        setCity(
          data && data.dataList && data.dataList[0] && data.dataList[0].city,
        );
        setCityList(data && data.dataList);
        setStateName({
          idState:
            data && data.dataList && data.dataList[0] && data.dataList[0].state,
          name: States.find(_ => _.value == data.dataList[0].state).label,
        });
        setStateNameError(false);
        setCityError(false);
      } else {
        setPostCodeError(true);
      }
    } catch (error) {
      console.log('error hai', error);
    }
  };
  // &&
  //     (addresses[invoiceType].error || []).includes('pincode') &&

  useEffect(() => {
    if (
      addresses[invoiceType] &&
      addresses[invoiceType].status == 'FAILED_FETCH' &&
      addresses[invoiceType].error &&
      !pinMaperror &&
      postCode &&
      postCode.length
    ) {
      setpinMaperror(addresses[invoiceType].error || '');
    }
  }, [addresses[invoiceType].status]);

  const onEnterGstin = async () => {
    setGstin(gstin);
    if (gstin && gstin.length > 14 && gstin.match(gstinRegex)) {
      setGstinError(false);
      const {data} = await validateGstin(gstin, sessionId, token);
      // if(data)
      if (data.valid) {
        setGstinVerified(true);
        setName(data.taxpayerDetails.legal_name_of_business);
        setAddressLine(
          `${data.taxpayerDetails.billing_address.addr.bno}, ${data.taxpayerDetails.billing_address.addr.bnm}, ${data.taxpayerDetails.billing_address.addr.st}, ${data.taxpayerDetails.billing_address.addr.loc}`,
        );
        setNameError(false);
        setAddressLineError(false);
        onSetPincode(data.taxpayerDetails.billing_address.addr.pncd);
      } else {
        Toast.show({
          type: 'error',
          text2: data.message,
          visibilityTime: 4000,
          autoHide: true,
        });
        setGstinVerified(false);
        // setGstinError(true);
      }
    } else {
      setGstinError(true);
    }
  };

  const getLocation = async () => {
    if (Platform.OS === 'ios') {
      // your code using Geolocation and asking for authorisation with
      Geolocation.requestAuthorization();
      Geolocation &&
        Geolocation.getCurrentPosition(async info => {
          if (info && info.coords && info.coords.latitude) {
            Mapmyindia &&
              Mapmyindia.rev_geocode(
                {
                  lat: info.coords.latitude,
                  lng: info.coords.longitude,
                },
                response => {
                  if (response && response.results && response.results.length) {
                    let addressData = response.results[0];
                    setUpdateAddressModal(true);
                    setTempAddress(addressData);
                  }
                },
              );
          }
        });
    } else {
      const responsePermission = await request(
        PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
      );
      if (RESULTS.GRANTED || RESULTS.LIMITED) {
        Geolocation &&
          Geolocation.getCurrentPosition(async info => {
            if (info && info.coords && info.coords.latitude) {
              Mapmyindia &&
                Mapmyindia.rev_geocode(
                  {
                    lat: info.coords.latitude,
                    lng: info.coords.longitude,
                  },
                  response => {
                    if (
                      response &&
                      response.results &&
                      response.results.length
                    ) {
                      let addressData = response.results[0];
                      setUpdateAddressModal(true);
                      setTempAddress(addressData);
                    }
                  },
                );
            }
          });
      } else {
        Toast.show({
          type: 'error',
          text2: 'Please grant permission to access Location',
          visibilityTime: 2000,
          autoHide: true,
        });
      }
    }
  };

  const isPhoneVerified = () => {
    let user_phone_verified = phone == user.phone && user.phoneVerified;
    let shipping_addresses = [
      ...((addresses &&
        addresses['tax'] &&
        addresses['tax'].data &&
        addresses['tax'].data.filter(
          _ =>
            _.phone == phone &&
            _.phoneVerified &&
            _.addressType.addressType == 'shipping',
        )) ||
        []),
      ...((addresses &&
        addresses['retail'] &&
        addresses['retail'].data &&
        addresses['retail'].data.filter(
          _ =>
            _.phone == phone &&
            _.phoneVerified &&
            _.addressType.addressType == 'shipping',
        )) ||
        []),
    ];
    if (
      (shipping_addresses && shipping_addresses.length) ||
      user_phone_verified
    ) {
      return true;
    }
    return false;
  };

  const onCloseModal = () => {
    setUpdateAddressModal(false);
    setTempAddress({});
  };

  const onCloseOTPModal = () => {
    setOTPModal(false);
  };

  const onUpdateLocation = () => {
    onSetPincode(tempAddress.pincode);
    // tempAddress.houseNumber} ${tempAddress.houseName} ${tempAddress.street}`.trim() +
    setAddressLine(
      tempAddress.subSubLocality +
        ' ' +
        tempAddress.subLocality +
        ' ' +
        tempAddress.locality +
        ' ' +
        tempAddress.subDistrict +
        ' ' +
        tempAddress.district,
    );
    setAddressLineError(false);
    setUsedGetLocation(true);
    setUpdateAddressModal(false);
  };

  const renderInputText = ({
    onChange,
    onBlur,
    disabled,
    title,
    state,
    errorState,
    extra,
    errorText,
    keyboardType,
    maxLength,
    component,
    style,
  }) => {
    if (component) {
      return component();
    } else {
      return (
        <View style={[styles.newinputfield, style]} key={title}>
          {title == 'City/District/Town*' || title == 'City*' ? (
            <View style={styles.newinputfieldwithpicker}>
              {/* <FloatingLabelInputField
               style={styles.inputwrap}
               label="City/District/Town*"
               hideLabel={this.state.city !== ''}
             /> */}
              <View style={styles.citystateinputview}>
                {Platform.OS == 'android' ? (
                  <Picker
                    mode="dropdown"
                    disabled={disabled}
                    placeholder="City"
                    // iosIcon={<MatIcon name="arrow-down" />}
                    selectedValue={city}
                    onValueChange={itemValue => onChange && onChange(itemValue)}
                    style={styles.pickerCss}>
                    {[{city: 'City'}, ...cityList].map(item => {
                      return (
                        <Picker.Item
                          label={item.city}
                          value={item.city == 'City' ? '' : item.city}
                        />
                      );
                    })}
                  </Picker>
                ) : (
                  <IOSPicker
                    //data={data}
                    placeholder="City"
                    mode="modal"
                    selectedValue={city ? city : 'city*'}
                    onValueChange={itemValue => onChange && onChange(itemValue)}
                    style={styles.pickerCss}
                    textStyle={styles.textStylecss}>
                    {[{city: 'City'}, ...cityList].map(item => {
                      return (
                        <Picker.Item
                          label={item.city}
                          value={item.city == 'City' ? '' : item.city}
                        />
                      );
                    })}
                  </IOSPicker>
                )}
              </View>
            </View>
          ) : (
            <FloatingLabelInputField
              showSoftInputOnFocus={true}
              label={title}
              onChangeText={text => onChange && onChange(text)}
              value={state}
              disabled={disabled}
              onBlur={onBlur}
              // errorBorder={'#D9232D'}
              maxLength={maxLength}
              keyboardType={keyboardType}
              // hideLabel={''}
            />
          )}

          {extra ? extra() : null}
          {errorState ? (
            <Text style={styles.errorText}>{errorText}</Text>
          ) : null}
        </View>
      );
    }
  };

  const checkCommonValidation = () => {
    return (
      name &&
      name.length &&
      !nameError &&
      !emailError &&
      phone &&
      phone.length > 9 &&
      !phoneError &&
      email &&
      email.length &&
      email.match(emailRegex) &&
      !emailError &&
      // alternatePhone &&
      // alternatePhone.length > 9 &&
      !alternatePhoneError &&
      area &&
      area.length > 1 &&
      !areaError &&
      addressLine &&
      addressLine.length &&
      addressLine.replace('|', ',').match(addressLineRegex) &&
      !addressLineError &&
      country &&
      !countryError &&
      postCode &&
      postCode.length > 5 &&
      !postCodeError &&
      stateName &&
      stateName.idState &&
      !stateNameError &&
      city &&
      city.length &&
      !cityError
    );
  };

  const checkValidation = () => {
    if (title == 'Billing Address') {
      if (
        gstin &&
        gstin.length > 14 &&
        gstin.match(gstinRegex) &&
        !gstinError &&
        gstinVerified &&
        checkCommonValidation()
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      if (checkCommonValidation()) {
        return false;
      } else {
        return true;
      }
    }
  };

  const checkPhoneVerified = () => {
    if (!isPhoneVerified()) {
      //add code for otp verification for phone number
      setVerifyPhoneModal(true);
    } else {
      onAddressUpdate();
    }
  };

  const onAddressUpdate = () => {
    setpinMaperror(false);
    let addressData = {
      active: true,
      addressCustomerName: name,
      addressLine: area + ' | ' + addressLine,
      city,
      email,
      idAddress: address.idAddress || null,
      idAddressType: address.addressType
        ? address.addressType.idAddressType
        : gstin
        ? 2
        : 1,
      idCountry: 110,
      idCustomer: userId,
      idState: stateName.idState,
      landmark,
      alternatePhone: alternatePhone || null,
      phoneVerified: true,
      phone,
      postCode,
    };
    if (title == 'Billing Address') {
      addressData = {
        ...addressData,
        gstin,
        invoiceType: 'tax',
        isGstInvoice: 1,
      };
    } else {
      addressData = {
        ...addressData,
        isGstInvoice: invoiceType == 'tax',
        invoiceType: invoiceType == 'tax' ? 'tax' : 'retail',
      };
    }
    dispatch(
      updateAddressByInvoiceType(
        userId,
        invoiceType,
        addressData,
        sessionId,
        token,
        title,
        currActiveShippingId,
      ),
    );
    setLoader(true);
    adobesaveAddressEventTracking();
  };

  const adobesaveAddressEventTracking = () => {
    let catL1 = [];
    let catL2 = [];
    let catL3 = [];
    let prices = [];
    let msns = [];
    let brand = [];
    let products = [];
    let totalQuantity = 0;
    if (itemsList && itemsList.length) {
      (itemsList || []).forEach(item => {
        let cats = item.taxonomyCode.split('/');
        prices.push(item.productUnitPrice);
        msns.push(item.productId);
        brand.push(item.brandName);
        totalQuantity = totalQuantity + item.productQuantity;
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
    }
    let cartOffer;
    if (!cart?.cart?.totalOffer) {
      cartOffer = 0;
    } else {
      cartOffer = cart?.cart?.totalOffer;
    }

    trackStateAdobe('moglix: add address', {
      'myapp.pageName': 'moglix: add address',
      'myapp.channel': 'checkout',
      'myapp.productCategoryL1': catL1.join('|'),
      'myapp.productCategoryL2': catL2.join('|'),
      'myapp.productCategoryL3': catL3.join('|'),
      'myapp.productID': msns.join('|'),
      'myapp.totalDiscount': `${cartOffer}`,
      'myapp.totalQuantity': `${totalQuantity}`,
      'myapp.totalPrice': `${Math.ceil(
        cart.cart.totalAmount + cart.cart.shippingCharges - cartOffer,
      )}`,
      'myapp.productPrice': prices.join('|'),
      'myapp.brand': brand.join('|'),
      '&&events': 'event13',
      '&&products': products.join(','),
      'myapp.isUseMyLocationused': usedGetLocation ? 'yes' : 'no',
      'myapp.isAddressSuggestionUsed': 'no',
    });
  };

  const onClosePhoneModal = () => {
    setVerifyPhoneModal(false);
  };

  const phoneVerifiedSuccess = () => {
    onClosePhoneModal();
    onAddressUpdate();
  };

  return (
    <View style={styles.addrModuleWrap}>
      <Header
        showBack
        showText={`${address && address.idAddress ? 'Edit' : 'Add'} ${title}`}
        navigation={props.navigation}
      />
      <ScrollView
        contentContainerStyle={
          isKeyboardVisible
            ? {minHeight: Dimensions.get('window').height + 100}
            : null
        }
        style={styles.scrollViewPage}>
        <View style={styles.inputViewWrap}>
          {title == 'Billing Address'
            ? billingAddresses.map((_, k) =>
                renderInputText(
                  gstinVerified
                    ? {..._}
                    : {
                        ..._,
                        disabled: _.title != 'GST No.*' ? true : _.disabled,
                      },
                ),
              )
            : shippingAddresses.map((_, k) => renderInputText(_))}
        </View>
        {/* <View style={styles.addnearby}>
          <TouchableOpacity style={styles.addnearbywrap}>
            <Text style={styles.addnearbytext}>
              + Add Nearby Famous Shop, Mall, Landmark
            </Text>
          </TouchableOpacity>
        </View> */}
        {/* <View style={styles.addnearby}>
          <TouchableOpacity style={styles.checkboxContainer}>
            <MaterialCommunityIcon name={'checkbox-blank-outline'} size={24} style={styles.uncheck} />
            <MaterialCommunityIcon name={'checkbox-marked'} size={24} style={styles.check} />
            <Text style={styles.checklabel}>Mark as default shipping address</Text>
          </TouchableOpacity>
        </View> */}
        {title != 'Billing Address' ? (
          <View style={styles.mapmyindiarow}>
            <Text style={styles.mapmyindiatext}>Powered By</Text>
            <Image
              source={require('../../assets/images/map-my-india-logo.png')}
              style={styles.mapmyindiaimage}
              resizeMode="contain"
            />
          </View>
        ) : null}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          disabled={
            checkValidation() ||
            addresses[invoiceType].status === STATE_STATUS.FETCHING
          }
          accessibilityLabel="SaveAddress"
          onPress={
            title == 'Billing Address' ? onAddressUpdate : checkPhoneVerified
          }
          style={[
            {
              backgroundColor:
                checkValidation() ||
                addresses[invoiceType].status === STATE_STATUS.FETCHING
                  ? '#C4C4C4'
                  : '#D9232D',
            },
            styles.checkoutBtn,
          ]}>
          {addresses[invoiceType].status === STATE_STATUS.FETCHING ? (
            <ActivityIndicator color={'#fff'} />
          ) : null}
          <Text style={styles.checkoutText}>SAVE ADDRESS</Text>
        </TouchableOpacity>
      </View>
      {updateAddressModal && (
        <UpdateAddressModal
          closeModal={onCloseModal}
          updateLocationAddress={onUpdateLocation}
          isVisible={updateAddressModal}
          addressData={tempAddress}
        />
      )}
      {verifyPhoneModal && (
        <VerifyPhoneModal
          closeModal={onClosePhoneModal}
          phoneVerifiedSuccess={phoneVerifiedSuccess}
          isVisible={verifyPhoneModal}
          phone={phone}
          auth={{sessionId, token, userId}}
        />
      )}
      {/* Enter OTP MODAL */}
      <OTPModal closeModal={onCloseOTPModal} isVisible={otpModal} />
    </View>
  );
};

export default UpdateAddressScreen;
