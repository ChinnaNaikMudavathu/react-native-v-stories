import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, Alert } from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import PropTypes from 'prop-types';
import constants from './constants';
import Video from 'react-native-video';

import VideoPlayer from "../../src/VideoPlayer";

const { colors } = constants;

function usePrevious(value) {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
}

const StoryImages = ({
  images,
  color,
  duration,
  containerStyle,
  imageStyle,
  progressContainerStyle
}) => {
  const [index, setIndex] = useState(0);
  const items = images.length;

  const timer = useRef(null);
  const [animationDuration, setAnimationDuration] = useState(duration);

  const prevIndex = usePrevious(index);
  const width = Math.floor(constants.width / items) - 4;
  const [AnimateOne, setAnimateOne] = useState(
    new Array(items).fill(0).map(item => new Animated.Value(0))
  );
  const imageScale = useRef(new Animated.Value(1));

  function animateStoryProgress(startIndex = 0) {
    for (let i = startIndex; i < items; i++) {
      Animated.timing(AnimateOne[i], {
        toValue: width,
        delay: animationDuration * (i - startIndex),
        useNativeDriver: true,
        duration: animationDuration
      }).start();
    }
  }
  const isOdd = index % 2;

  const setTimer = () => {
    if (timer.current) {
      clearInterval(timer.current);
    }
    timer.current = setInterval(() => {
      setIndex(i => (i < items - 1 ? i + 1 : 0));
    }, animationDuration);
  };

  function onTap(event) {
    const tapX = event.nativeEvent.locationX;
    if (tapX < constants.width / 2) {
      if (index > 0) {
        setTimer();
        const nextIndex = prevIndex < index ? prevIndex : index - 1;
        setIndex(nextIndex);
        AnimateOne.slice(nextIndex).forEach(item => {
          item.setValue(0);
          item.stopAnimation();
        });
        animateStoryProgress(nextIndex);
      }
      return;
    }
    if (index < items - 1) {
      setTimer();
      setIndex(index + 1);
      AnimateOne.slice(index).forEach(item => {
        item.setValue(0);
        item.stopAnimation();
      });
      AnimateOne[index].setValue(width);
      animateStoryProgress(index + 1);
    }
  }

  function animateScale() {
    Animated.timing(imageScale.current, {
      toValue: isOdd ? 1 : 1.1,
      useNativeDriver: true,
      duration: animationDuration
    }).start(() => {
      if (isOdd) imageScale.current.setValue(1);
    });
  }

  useEffect(() => {
    setAnimationDuration(duration);
  }, [duration]);

  useEffect(() => {
    setTimer();
    return () => clearInterval(timer.current);
  }, [images]);

  useEffect(() => {
    if (index === 0 && prevIndex === items - 1) {
      setAnimateOne(
        new Array(items).fill(0).map(item => new Animated.Value(0))
      );
      imageScale.current.setValue(1);
    }
    animateScale();
  }, [index]);

  useEffect(() => {
    animateStoryProgress();
  }, [AnimateOne]);

  const opacity = imageScale.current.interpolate({
    inputRange: [1.09, 1.1],
    outputRange: isOdd ? [1, 0.2] : [0.95, 1]
  });
  return (
    <TouchableOpacity
      onPress={onTap}
      activeOpacity={0.8}
      style={containerStyle}
    >
      <TouchableOpacity onPress={() => Alert.alert('close button pressed!')} style={{ alignSelf: 'flex-end', position: 'absolute', top: 25, zIndex: 1, right: 16, elevation: 10 }}><MaterialIcon name="close" size={24} color="#ffffff" /></TouchableOpacity>
      <Animated.Image
        source={{ uri: images[index].uri }}
        style={[{
          opacity,
          // transform: [{ scale: imageScale.current }],
        },
          imageStyle
        ]}
      />
      <View style={progressContainerStyle}>
        {images.map((item, i) => (
          <View
            key={item.uri}
            style={{
              height: 4,
              overflow: 'hidden',
              width,
              backgroundColor: color
            }}
          >
            <Animated.View
              style={{
                height: 4,
                position: 'relative',
                transform: [{ translateX: AnimateOne[i] }],
                left: 0,
                top: 0,
                backgroundColor: colors.darkgrey
              }}
            />
          </View>
        ))}
      </View>
      {/* <VideoPlayer video={{uri: "https://www.youtube.com/watch?v=MHradBkOYe0"}} volume={0.5}/> */}
      <TouchableOpacity onPress={() => Alert.alert('Explore now pressed!')} style={{ zIndex: 2, elevation: 20, marginHorizontal: 16, backgroundColor: '#ffffff', borderRadius: 4, paddingVertical: 14, position: 'relative', bottom: constants.height * 0.10 }}><Text style={{ color: '#222222', fontSize: 16, textAlign: 'center' }}>Explore now</Text></TouchableOpacity>
    </TouchableOpacity>
  );
};

StoryImages.defaultProps = {
  color: colors.func_yellow,
  duration: 6000,
  containerStyle: {
    flex: 1,
    backgroundColor: colors.theme_dark,
    justifyContent: 'space-around',
    paddingTop: constants.statusBarHeight
  },
  progressContainerStyle: {
    width: constants.width,
    flexDirection: 'row',
    position: 'absolute',
    left: 0,
    top: 0,
    justifyContent: 'space-between'
  },
  imageStyle: {
    width: constants.width,
    height: constants.height,
  }
};

StoryImages.propTypes = {
  images: PropTypes.array.isRequired,
  color: PropTypes.string,
  containerStyle: PropTypes.object,
  progressContainerStyle: PropTypes.object,
  imageStyle: PropTypes.object,
  duration: PropTypes.number
};

export default StoryImages;
