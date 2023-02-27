import { Appearance, GestureResponderEvent, LayoutChangeEvent, ListRenderItemInfo, NativeScrollEvent, NativeSyntheticEvent, Pressable, StatusBar, StyleSheet, Text, View } from 'react-native';
import Animated, { event, Extrapolate, interpolate, runOnJS, runOnUI, useAnimatedGestureHandler, useAnimatedRef, useAnimatedScrollHandler, useAnimatedStyle, useDerivedValue, useSharedValue, withSpring } from 'react-native-reanimated';
import ImmersiveMode from 'react-native-immersive-mode';
import FullScreenChz from 'react-native-fullscreen-chz';
import data from "./dataProvider";
import SystemNavigationBar from 'react-native-system-navigation-bar';
import { useEffect, useRef } from 'react';
import { SafeAreaProvider, SafeAreaView, useSafeArea } from 'react-native-safe-area-context';
import { GestureHandlerRootView, PanGestureHandler, PanGestureHandlerGestureEvent } from 'react-native-gesture-handler';
function renderItem(item: ListRenderItemInfo<string>) {
  let isFullScreen = false;
  return <Pressable onPress={() => {
    isFullScreen = !isFullScreen;
    SystemNavigationBar.fullScreen(isFullScreen);
  }}>
    <View style={styles.listItem}>
      <Text style={styles.listItemText}>{item.item}</Text>
    </View>
  </Pressable>
}
export default function App() {

  const lastContentOffset = useSharedValue(0);
  const currentState = useSharedValue(false);

  useEffect(() => {
    //SystemNavigationBar.lowProfile();
    //SystemNavigationBar.setNavigationColor('#000', 'light', 'navigation');
    //SystemNavigationBar.setNavigationColor("red", "light", "both");
    SystemNavigationBar.fullScreen(true);
  })

  const onContentSizeChange = (width: number, height: number) => {
    contentHeight = height;
    console.log(onContentSizeChange.name, width, height);
  }
  let barHeight = 0;
  let contentHeight = 0;
  const flatlist = useAnimatedRef<Animated.FlatList<any>>();
  const progress = useSharedValue(0);

  const onLayout = (event: LayoutChangeEvent) => {
    console.log(onLayout.name, event.nativeEvent.layout.height);
  }

  const translation = {
    x: useSharedValue(0),
    y: useSharedValue(0),
  };
  type AnimatedGHContext = {
    startX: number;
    startY: number;
  };
  const barMove = () => {
    console.log("barMove", progress.value);
    let position = progress.value * (contentHeight / barHeight);
    //var current = flatlist?.current?.getNode();
    console.log(flatlist?.current);
    //console.log("barMove", current, progress.value, position);
    //flatlist.current.getNode().scrollToOffset({ offset: position, animated: false });
  }
  const gestureHandler = useAnimatedGestureHandler<
    PanGestureHandlerGestureEvent,
    AnimatedGHContext
  >({
    onStart: (_, ctx) => {
      //console.log("onStart", ctx);
      ctx.startX = translation.x.value;
      ctx.startY = translation.y.value;
    },
    onActive: (event, ctx) => {
      console.log("onActive", event.translationX, event.translationY);
      translation.x.value = ctx.startX + event.translationX;
      translation.y.value = ctx.startY + event.translationY;
      progress.value = translation.y.value;
      runOnJS(barMove)();

    },
    onEnd: (_) => {
      console.log("onEnd", _);

      //translation.x.value = withSpring(_.translationX);
      //translation.y.value = withSpring(_.translationY);
    },
  });

  const stylez = useAnimatedStyle(() => {
    const H = Math.round(
      interpolate(translation.x.value, [0, 300], [0, 360], Extrapolate.CLAMP)
    );
    const S = Math.round(
      interpolate(translation.y.value, [0, 500], [100, 50], Extrapolate.CLAMP)
    );
    const backgroundColor = `hsl(${H},${S}%,50%)`;
    return {
      transform: [

        {
          translateY: translation.y.value,
        },
      ],
      backgroundColor,
    };
  });


  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView style={styles.container}>
          <View style={{
            width: "100%",
            flex: 1,
            position: "relative",
          }}>
            <View
              onLayout={(event) => {
                barHeight = event.nativeEvent.layout.height;
                console.log("onLayoutBar", event.nativeEvent.layout.height);
              }}
              style={{ position: "absolute", overflow: "visible", zIndex: 3, width: 5, height: "90%", top: "5%", right: 15, backgroundColor: "rgba(0,0,0,0.2)" }}
            >
              <PanGestureHandler onGestureEvent={gestureHandler}>
                <Animated.View
                  style={[{

                    top: 0,
                    borderRadius: 10,
                    marginLeft: -15,
                    height: 40,
                    width: 40,
                    backgroundColor: "green"
                  }, stylez]} />
              </PanGestureHandler>
            </View>
            <Animated.FlatList
              ref={flatlist}
              onLayout={onLayout}
              onContentSizeChange={onContentSizeChange}
              //onScroll={onScroll}
              numColumns={1}

              style={styles.list}
              data={data}
              renderItem={renderItem}
              keyExtractor={(item) => `key${item}`}
            />
          </View>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  listItemText: {
    color: "#999999"
  },
  listItem: {
    flex: 1,
    backgroundColor: "#282828",
    padding: 10,
    paddingBottom: 20,
    paddingTop: 20,
    color: "#fff",
    borderBottomColor: "#FFF",
    borderBottomWidth: 1
  },
  list: {
    width: "100%",
  },
  container: {
    backgroundColor: "#282828",
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});



