import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Image, TouchableOpacity, Alert } from 'react-native';
import { connect } from 'react-redux';
import ImagePicker from 'react-native-image-picker';
import { Content, Text, ListItem, Left, View } from 'native-base';

import * as authActions from '~/store/actions/auth';
import * as commonActions from '~/store/actions/common';
// import * as campaignActions from '~/store/actions/campaign';

// import * as accountSelectors from '~/store/selectors/account';
import * as authSelectors from '~/store/selectors/auth';
import images from '~/assets/images';
import Icon from '~/elements/Icon';

import options from './options';
import styles from './styles';

// import { API_BASE } from '~/store/constants/api';
const imagePickerOptions = {
  title: 'Select Avatar',
  customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
};
@connect(
  state => ({
    socialType: authSelectors.getSocialType(state)
  }),
  { ...authActions, ...commonActions }
)
export default class extends PureComponent {
  static propTypes = {
    route: PropTypes.object.isRequired
  };

  onFanProfilePress() {
    const { forwardTo, closeDrawer } = this.props;
    closeDrawer();
    forwardTo('fanProfile');
  }

  _handleSuccessLogout() {
    const { forwardTo, setToast, removeAllCampaign } = this.props;
    // OneSignal.deleteTag("user_id")
    removeAllCampaign();
    forwardTo('login');
    setToast('Logout successfully!!!');
  }

  _handleFailLogout(error) {
    const { forwardTo, setToast, removeAllCampaign } = this.props;
    // OneSignal.deleteTag("user_id")
    removeAllCampaign();
    forwardTo('login');
    setToast(error.msg, 'error');
  }

  navigateTo(route) {
    const { forwardTo, closeDrawer } = this.props;
    closeDrawer();
    forwardTo(route);
  }

  changeAvatar() {
    ImagePicker.showImagePicker(imagePickerOptions, response => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        const source = { uri: response.uri };

        // You can also display the image using data:
        // const source = { uri: `data:image/jpeg;base64,${response.data}` };
        Alert.alert('Change Avatar successfull', `Pick avatar successfull uri: ${source.uri}`, [
          {
            title: 'Ok'
          }
        ]);

        // this.setState({
        //   avatarSource: source
        // });
      }
    });
  }

  render() {
    const { route } = this.props;
    return (
      <Content bounces={false} style={styles.container}>
        <ListItem onPress={this.onFanProfilePress.bind(this)} style={styles.drawerCover}>
          <TouchableOpacity activeOpacity={0.8} onPress={() => this.changeAvatar()}>
            <Image
              source={images.avatar}
              placeholder={<Icon name="image" style={styles.drawerImage} />}
              style={styles.drawerImage}
            />
          </TouchableOpacity>

          <Text large style={styles.text}>
            Name in sidebar
          </Text>
          <Text small style={styles.text}>
            example@example.com
          </Text>
          {/*<View style={styles.editContainer}>
              <Text small style={styles.text}>{'LA'}, {'USA'}</Text>
              /!*<Icon onPress={e=>{/!*this.navigateTo('user/profile')*!/}} name="edit" style={styles.iconEdit} />*!/
            </View>*/}
        </ListItem>
        <View style={styles.listItemContainer}>
          {options.listItems.map((item, index) => (
            <ListItem noBorder key={index} button onPress={() => this.navigateTo(item.route)}>
              <Left>
                <Icon name={item.icon} style={styles.icon} />
                <Text style={styles.iconText}>{item.name}</Text>
              </Left>
            </ListItem>
          ))}
          <ListItem noBorder button onPress={() => this.props.logout()} style={{ marginTop: 20 }}>
            <Left>
              <Icon name={'ios-log-out'} style={styles.icon} />
              <Text style={styles.iconTextLast}>Log out</Text>
            </Left>
          </ListItem>
        </View>
      </Content>
    );
  }
}
