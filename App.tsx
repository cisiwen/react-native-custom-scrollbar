import { FlatList, ListRenderItemInfo, NativeScrollEvent, NativeSyntheticEvent, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { useAnimatedScrollHandler, useSharedValue } from 'react-native-reanimated';
import ImmersiveMode from 'react-native-immersive-mode';
import FullScreenChz from 'react-native-fullscreen-chz';
import data from "./dataProvider";
const renderItem=(item:ListRenderItemInfo<string>)=>{
  return <View style={styles.listItem}>
    <Text style={styles.listItemText}>{item.item}</Text>
  </View>
}
export default function App() {
 
  const lastContentOffset = useSharedValue(0);
  const isUp = useSharedValue(false);
  
 
  const onScroll=(event:NativeSyntheticEvent<NativeScrollEvent>)=>{
    if (lastContentOffset.value > event.nativeEvent.contentOffset.y) {
        console.log("down");
        FullScreenChz.disable();
    }
    else if(lastContentOffset.value<event.nativeEvent.contentOffset.y) {
      console.log("up");
      FullScreenChz.enable();
    }
    lastContentOffset.value= event.nativeEvent.contentOffset.y;
  }
  return (
    <SafeAreaView style={styles.container}>
      <FlatList
      onScroll={onScroll}
      numColumns={1}
      style={styles.list}
      data={data}
      renderItem={renderItem}
      keyExtractor={(item)=>`key${item}`}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  listItemText:{
    color:"#999999"
  },
  listItem:{
    flex:1,
    backgroundColor:"#282828",
    padding:10,
    paddingBottom:20,
    paddingTop:20,
    color:"#fff",
    borderBottomColor:"#FFF",
    borderBottomWidth:1
  },
  list:{
    width:"100%"
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
 

 
