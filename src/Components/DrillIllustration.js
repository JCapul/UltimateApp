import React, { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, View, Text, Dimensions, TouchableOpacity, Image } from 'react-native';
import { WebView } from 'react-native-webview';

import Animation from './Animation';
import VimeoVideo from './VimeoVideo';
import GradientButton from './shared/GradientButton';
import { IllustrationType } from '../Fixtures';
import theme from '../styles/theme.style';
import iconRedo from '../../assets/redo_arrow.png';

const DrillIllustration = props => {
  const [currentStepIndex, setStepIndex] = useState(0);

  const currentStep = props.drill.steps[currentStepIndex];

  // back to 0 when drill change
  useEffect(() => {
    setStepIndex(0);
  }, [props.drill]);

  const incrementStepIndex = () => {
    setStepIndex((currentStepIndex + 1) % (props.drill.steps.length + 1));
  };

  const displayNextStep = () => {
    if (currentStepIndex + 1 === props.drill.steps.length) {
      return (
        <View>
          <View style={styles.description}>
            <View style={styles.wrapperFinish}>
              <Text style={styles.fitnessNext}>Finish</Text>
            </View>
          </View>
          <View style={styles.lines} />
        </View>
      );
    } else {
      return (
        <View>
          <View style={styles.description}>
            <View style={styles.subWrapper}>
              <Text style={styles.fitnessNext}>{props.drill.steps[currentStepIndex + 1].repetition}</Text>
            </View>
            <View style={styles.subSubWrapper}>
              <Text style={styles.fitnessNext}>{props.drill.steps[currentStepIndex + 1].title}</Text>
            </View>
            <View style={styles.fakeWrapper} />
          </View>
          <View style={styles.lines} />
        </View>
      );
    }
  };

  const checkSwitch = () => {
    if (currentStepIndex === props.drill.steps.length) {
      return displayFinish();
    } else if (!currentStep) {
      return <View />; // bad state, but let's not crash
    } else {
      switch (props.drill.steps[currentStepIndex].illustrationType) {
        case IllustrationType.ANIMATION:
          return displayAnimation(props.drill.steps[currentStepIndex]);
        case IllustrationType.YOUTUBE:
          return displayYoutube(props.drill.steps[currentStepIndex]);
        case IllustrationType.VIMEO:
          return displayVimeo(props.drill.steps[currentStepIndex]);
        default:
          return <Text>No visual content for this drill</Text>;
      }
    }
  };

  const displayFinish = () => {
    return (
      <View>
        <View style={styles.containerFinish}>
          <View>
            <Text style={styles.redoMessage}> You have seen all the steps of the drill </Text>
          </View>
          <View>
            <TouchableOpacity onPress={() => incrementStepIndex()}>
              <Image style={styles.favoriteImage} source={iconRedo} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  const displayStepsAnimation = title => {
    if (props.drill.steps.length <= 1) {
      return <View />;
    } else {
      return (
        <View style={styles.descriptionAnimation}>
          <View style={styles.subSubWrapper}>
            <Text style={styles.fitness}>{title}</Text>
          </View>
          <View style={styles.containerAnimation}>
            <TouchableOpacity style={styles.buttonNext} onPress={() => incrementStepIndex()} />
          </View>
        </View>
      );
    }
  };

  const displayAnimation = ({ illustrationSource, instruction, title }) => {
    return (
      <ScrollView>
        <View style={styles.pageAnimation}>
          <Animation widthRatio={1} heightRatio={1 / 2} animation={illustrationSource} />
        </View>
        <View style={styles.description}>
          <View style={styles.containerAnimation}>{displayStepsAnimation(title)}</View>
        </View>
        <View style={styles.lines} />
        <Text style={styles.instruction}>{instruction}</Text>
      </ScrollView>
    );
  };

  const displayYoutube = ({ illustrationSource, title, instruction }) => {
    return (
      <ScrollView>
        <WebView
          source={{
            uri: illustrationSource,
          }}
          style={styles.drillAnimationPage}
        />
        <View style={styles.description}>
          <View style={styles.containerAnimation}>{displayStepsAnimation(title)}</View>
        </View>
        <View style={styles.lines} />
        <Text style={styles.instruction}>{instruction}</Text>
      </ScrollView>
    );
  };

  const displayVimeo = ({ illustrationSource, repetition, title }) => {
    return (
      <View style={styles.drillAnimationPage}>
        <VimeoVideo vimeoId={illustrationSource} screenWidth={screenDimension.width} />
        <View>
          <View style={styles.description}>
            <View style={styles.subWrapper}>
              <Text style={styles.fitness}>{repetition}</Text>
            </View>
            <View style={styles.subSubWrapper}>
              <Text style={styles.fitness}>{title}</Text>
            </View>
            <TouchableOpacity style={styles.buttonNext} onPress={() => incrementStepIndex()} />
          </View>
          <View style={styles.lines} />
        </View>
        <View style={styles.container}>{displayNextStep()}</View>
      </View>
    );
  };

  return <View style={styles.container}>{checkSwitch()}</View>;
};

const screenDimension = Dimensions.get('window');
const styles = StyleSheet.create({
  drillAnimationPage: {
    flex: 1,
    height: screenDimension.height - 80,
  },
  container: {
    flex: 1,
  },
  containerFinish: {
    flex: 1,
    justifyContent: 'space-around',
    alignItems: 'center',
    height: screenDimension.height - 80,
  },
  redoMessage: {
    fontSize: theme.FONT_SIZE_MEDIUM,
    color: theme.COLOR_PRIMARY,
    fontWeight: 'bold',
  },
  containerAnimation: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
  },
  description: {
    flexDirection: 'row',
  },
  descriptionAnimation: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pageAnimation: {
    flex: 1,
    height: screenDimension.height - 160,
  },
  fitness: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    fontSize: theme.FONT_SIZE_LARGE,
    color: theme.COLOR_PRIMARY,
    fontWeight: 'bold',
  },
  fitnessNext: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    fontSize: theme.FONT_SIZE_LARGE,
    color: theme.COLOR_SECONDARY,
  },
  separator: {
    height: 15,
    borderRightWidth: 1,
    borderRightColor: theme.COLOR_PRIMARY_LIGHT,
  },
  buttonNext: {
    margin: 22.5,
    width: 25,
    height: 25,
    borderRadius: 12.5,
    backgroundColor: theme.BACKGROUND_COLOR_BUTTON,
    borderWidth: 2,
    borderColor: theme.BORDER_COLOR_BUTTON_ACTIVE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  subWrapper: {
    flex: 1,
    alignItems: 'center',
  },
  subSubWrapper: {
    flex: 6,
  },
  fakeWrapper: {
    width: 70,
  },
  lines: {
    borderBottomColor: '#DCDCDC',
    borderBottomWidth: 1,
  },
  wrapperFinish: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  finishMessage: {
    marginTop: 150,
    marginBottom: 20,
    marginLeft: 20,
    fontSize: theme.FONT_SIZE_LARGE,
    color: theme.COLOR_PRIMARY,
    fontWeight: 'bold',
  },
  instruction: {
    marginTop: 20,
    marginBottom: 20,
    marginLeft: 20,
    fontSize: theme.FONT_SIZE_MEDIUM,
    color: theme.COLOR_PRIMARY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  favoriteImage: {
    width: 60,
    height: 60,
  },
});

export default DrillIllustration;
