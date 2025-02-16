import { Image, StyleSheet, Platform,View, TextInput, Text, FlatList, ScrollView} from 'react-native';
import { Colors } from '@/constants/Colors';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button, Card, IconButton } from 'react-native-paper';


const data: Array<number> = [1,2,3,4,5 ,6]

export default function HomeScreen() {
  return (
    // picture and text
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <Image
          source={require('@/assets/images/homeImage.png')}
          style={styles.homeImage}
        />
      }
      title="Welcome!"
      subtitle="Share your expreriences, post questions and find support through a passionate community"
    >

      {/* search bar */}
      <TextInput style={styles.keywordInput}>
        Search for a keyword
      </TextInput>

      {/*filters  */}
      <View style={styles.filterContainer}>
        <IconButton icon="sort" />
        <Button 
          style={styles.filterButton} 
          labelStyle={{padding: 0,position: 'absolute', left: "auto", margin: 0}}
          contentStyle={{height: 25 }}
          mode="outlined"
          compact= {true}
        >
          <Text style={{fontSize: 9}}>Physical</Text>
        </Button>
        <Button 
          labelStyle={{padding: 0,position: 'absolute', left: "auto", margin: 0}}
          contentStyle={{height: 25 }}
          style={styles.filterButton} 
          mode='outlined'
          compact= {true}
        >
          <Text style={{fontSize: 9}}>Emotional</Text>
        </Button>
        <Button 
          labelStyle={{padding: 0,position: 'absolute', left: "auto", margin: 0}}
          contentStyle={{height: 25 }}
          style={styles.filterButton} 
          mode='outlined'
        >
          <Text style={{fontSize: 9}}>Sexual violence</Text>
        </Button>
      </View  >
      
      <ScrollView>
       {data.map((item, index) => {
          return<View style={styles.postContainer} key={index}>
            <ThemedText type="subtitle">Post {item}</ThemedText>
          </View>
        })}
      </ScrollView>



   </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    gap: 8,
  },
  keywordInput: {
    height: 30,
    borderWidth: 1,
    padding: 0,
    paddingLeft: 20,
    borderRadius: 15,
    backgroundColor: Colors.light.background,
  },
  filterContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: "5%"

    

  },
  filterButton: {
    width: "23%",
  },
  postContainer: {
    height: 100,
    width: "100%",
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  homeImage: {
    height: "100%",
    width:  "100%",
    bottom: 0,
    left: 0,
    borderRadius: 10,
    position: 'absolute',
  },
});
