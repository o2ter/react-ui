//
//  font-inject.web.js
//
//  The MIT License
//  Copyright (c) 2021 - 2022 O2ter Limited. All rights reserved.
//
//  Permission is hereby granted, free of charge, to any person obtaining a copy
//  of this software and associated documentation files (the "Software"), to deal
//  in the Software without restriction, including without limitation the rights
//  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
//  copies of the Software, and to permit persons to whom the Software is
//  furnished to do so, subject to the following conditions:
//
//  The above copyright notice and this permission notice shall be included in
//  all copies or substantial portions of the Software.
//
//  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
//  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
//  THE SOFTWARE.
//

import AntDesign from 'react-native-vector-icons/Fonts/AntDesign.ttf';
import Entypo from 'react-native-vector-icons/Fonts/Entypo.ttf';
import EvilIcons from 'react-native-vector-icons/Fonts/EvilIcons.ttf';
import Feather from 'react-native-vector-icons/Fonts/Feather.ttf';
import FontAwesome from 'react-native-vector-icons/Fonts/FontAwesome.ttf';
import FontAwesome5Solid from 'react-native-vector-icons/Fonts/FontAwesome5_Solid.ttf';
import FontAwesome5Regular from 'react-native-vector-icons/Fonts/FontAwesome5_Regular.ttf';
import FontAwesome5Brands from 'react-native-vector-icons/Fonts/FontAwesome5_Brands.ttf';
import Fontisto from 'react-native-vector-icons/Fonts/Fontisto.ttf';
import Foundation from 'react-native-vector-icons/Fonts/Foundation.ttf';
import Ionicons from 'react-native-vector-icons/Fonts/Ionicons.ttf';
import MaterialCommunityIcons from 'react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf';
import MaterialIcons from 'react-native-vector-icons/Fonts/MaterialIcons.ttf';
import Octicons from 'react-native-vector-icons/Fonts/Octicons.ttf';
import SimpleLineIcons from 'react-native-vector-icons/Fonts/SimpleLineIcons.ttf';
import Zocial from 'react-native-vector-icons/Fonts/Zocial.ttf';

import styleInject from 'style-inject';

styleInject(`
@font-face {
  src: url(${AntDesign});
  font-family: AntDesign;
}
@font-face {
  src: url(${Entypo});
  font-family: Entypo;
}
@font-face {
  src: url(${EvilIcons});
  font-family: EvilIcons;
}
@font-face {
  src: url(${Feather});
  font-family: Feather;
}
@font-face {
  src: url(${FontAwesome});
  font-family: FontAwesome;
}
@font-face {
  src: url(${FontAwesome5Solid});
  font-family: FontAwesome5;
}
@font-face {
  src: url(${FontAwesome5Regular});
  font-family: FontAwesome5_Regular;
}
@font-face {
  src: url(${FontAwesome5Brands});
  font-family: FontAwesome5Brands;
}
@font-face {
  src: url(${Fontisto});
  font-family: Fontisto;
}
@font-face {
  src: url(${Foundation});
  font-family: Foundation;
}
@font-face {
  src: url(${Ionicons});
  font-family: Ionicons;
}
@font-face {
  src: url(${MaterialCommunityIcons});
  font-family: MaterialCommunityIcons;
}
@font-face {
  src: url(${MaterialIcons});
  font-family: MaterialIcons;
}
@font-face {
  src: url(${Octicons});
  font-family: Octicons;
}
@font-face {
  src: url(${SimpleLineIcons});
  font-family: SimpleLineIcons;
}
@font-face {
  src: url(${Zocial});
  font-family: Zocial;
}
`);