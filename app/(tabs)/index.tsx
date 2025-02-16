import { Image, StyleSheet, Platform,View, TextInput, Text, FlatList, ScrollView} from 'react-native';
import { Colors } from '@/constants/Colors';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Button, Card, IconButton } from 'react-native-paper';
import { purple100 } from 'react-native-paper/lib/typescript/styles/themes/v2/colors';


type PostProps = {title: string, author: string, date: string, body: string, tags: Array<string>}
const data: Array<PostProps> = [
  {title: "Just moved to canada", author: "Rohit India", date: "2025-01-1T12:00:00Z" , body:"hime lahjfajhfsjkd aflh lafhl hockey and donuts and i don't know need text lorem i7 a thing is some thign which is also a thing so cool wow", tags: ["tag1", "tag2"]},
  {title: "Rohit is a little bitch", author: "Marko", date: "2025-02-12T13:00:00Z" , body: "hime lahjfajhfsjkd", tags: ["tag1", "tag2"]},
  {title: "But I love him so much <3", author: "Marko", date: "2025-02-15T17:00:00-07:00" , body: "hime lahjfajhfsjkd", tags: ["tag1", "tag2"]},
]



const Post = ({title, author, date, body, tags}: PostProps) => {
  
  const timeSince = (timeString:string) => {
    const now: Date = new Date();
    const then: Date = new Date(timeString);

    const hours:number =  Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60));
    if (hours < 24) return `${hours} hours ago`;

    const days:number = Math.floor(hours / 24);
    if (days < 7) return `${days} days ago`;

    return `${then.getDate()}-${then.getMonth()}-${then.getFullYear()}`;
  }
  
  return(
    <View style={styles.postContainer}>
      <ThemedText type="default">{author}</ThemedText>

      {/* title and date */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <ThemedText type="subtitle">{title}</ThemedText>
        <ThemedText type="default">{timeSince(date)}</ThemedText>
      </View>
      
      {/* body  */}
      <View style={{width: "80%", position: "relative", marginVertical: 10}}>
        <Text numberOfLines={3} ellipsizeMode="tail" >{body.slice(0, 100)}</Text>
      </View>


      {/* tags  */}
      <View style={{marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'flex-start'}}>
        {tags.map((tag, index) => (
          <Text 
            key={index}
            style={{ textAlign: "center", borderColor: "purple", borderWidth: 1, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 3, width: 70, fontSize: 10}}
          >
            {tag}
          </Text>))}
      </View>
    </View>
  )

}

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
      
       {data.map((post, index) => {
          return <Post title={post.title} author={post.author} date={post.date} body={post.body} tags={post.tags}/> 
        })}



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
    height: 170,
    marginTop: 10,
    width: "100%",
    borderBottomWidth: 1,
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
