import { Image, StyleSheet, View, TextInput, Text, Alert, ActivityIndicator } from 'react-native';
import { Colors } from '@/constants/Colors';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { Button, IconButton } from 'react-native-paper';
import { useInfiniteQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Controller, useFormContext } from 'react-hook-form';
import { SearchBarData } from '@/lib/types';
import { SearchBarContextProvider } from '@/contexts/searchBarContext';
import { FlashList } from '@shopify/flash-list';

type PostProps = { title: string, author: { name: string }, date: string, body: string, tags: Array<string> }

const Post = ({ title, author, date, body, tags }: PostProps) => {

    const timeSince = (timeString: string) => {
        const now: Date = new Date();
        const then: Date = new Date(timeString);

        const hours: number = Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60));
        if (hours < 24) return `${hours} hours ago`;

        const days: number = Math.floor(hours / 24);
        if (days < 7) return `${days} days ago`;

        return `${then.getDate()}-${then.getMonth() + 1}-${then.getFullYear()}`;
    }

    return (
        <View style={styles.postContainer}>
            <ThemedText type="default">{author.name}</ThemedText>

            {/* title and date */}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <ThemedText type="subtitle">{title}</ThemedText>
                <ThemedText type="default">{timeSince(date)}</ThemedText>
            </View>

            {/* body  */}
            <View style={{ width: "80%", position: "relative", marginVertical: 10 }}>
                <Text numberOfLines={3} ellipsizeMode="tail" >{body.slice(0, 100)}</Text>
            </View>


            {/* tags  */}
            <View style={{ marginBottom: 20, flexDirection: 'row', alignItems: 'center', gap: 10, justifyContent: 'flex-start' }}>
                {tags.map((tag, index) => (
                    <Text
                        key={index}
                        style={{ textAlign: "center", borderColor: "purple", borderWidth: 1, borderRadius: 10, paddingHorizontal: 5, paddingVertical: 3, width: 70, fontSize: 10 }}
                    >
                        {tag}
                    </Text>))}
            </View>
        </View>
    )

}

type MediaItem = {
    _id: string;
    path: string;
    type: string;
};

type Creator = {
    _id: string;
    name: string;
    email: string;
    username: string;
    clerkId: string;
    language: string;
    pushTokens: string[]; // Assuming pushTokens is an array of strings
    createdAt: string; // Use Date if you plan to parse it
    updatedAt: string; // Use Date if you plan to parse it
};

type Post = {
    _id: string;
    title: string;
    caption: string;
    media: MediaItem[];
    creator: Creator;
    tags: string[];
    createdAt: string; // Use Date if you plan to parse it
    updatedAt: string; // Use Date if you plan to parse it
};
const searchPosts = async ({ searchTerm, page, limit }: { searchTerm: string, page: number, limit: number }): Promise<Post[]> => {
    const res = await axios.get('https://calgary-hacks-2025.vercel.app/api/posts', {
        params: {
            searchTerm,
            page,
            limit
        }
    })

    return res.data.posts
}

const limit = 4;

function PostsList() {
    const { watch } = useFormContext<SearchBarData>();

    const searchTerm = watch("searchTerm");

    const {
        data,
        isLoading: queryIsLoading,
        isRefetching,
        refetch,
        isFetching,
        isFetchingNextPage,
        fetchNextPage,
        hasNextPage
    } = useInfiniteQuery({
        queryKey: ["posts", searchTerm],
        queryFn: async ({ pageParam }: { pageParam: number }) => {
            try {
                return await searchPosts({
                    searchTerm,
                    page: pageParam,
                    limit
                });
            } catch (error) {
                Alert.alert("Error", "An error occured while fetching posts");
                return null
            }
        },
        getNextPageParam: (lastPage, pages) => {
            if (lastPage && lastPage.length === limit) {
                return pages.length;
            }
            return null;
        },
        initialPageParam: 0,
        initialData: { pages: [[]], pageParams: [0] }
    });

    const loadMore = () => {
        if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
        }
    };

    const posts = data?.pages?.flatMap(page => page || []) || []

    return (
        <FlashList
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
            data={posts}
            renderItem={({ item }) => (
                <Post
                    title={item.title}
                    author={item.creator}
                    date={item.createdAt}
                    body={item.caption}
                    tags={item.tags}
                />
            )}
            ListFooterComponent={isFetching && !isFetchingNextPage ? <ActivityIndicator /> : null}
            onEndReached={loadMore}
            onEndReachedThreshold={2}
            keyExtractor={item => item._id}
        />
    )
}
function SearchBar() {
    const { control } = useFormContext<SearchBarData>();

    return (
        <Controller
            control={control}
            name="searchTerm"
            render={({ field: { onBlur, onChange, value } }) => (
                <TextInput
                    placeholder="Search..."
                    style={styles.keywordInput}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    value={value}
                />
            )}
        />
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
            <SearchBarContextProvider>
                {/* search bar */}
                <SearchBar />

                {/*filters  */}
                <View style={styles.filterContainer}>
                    <IconButton icon="sort" />
                    <Button
                        style={styles.filterButton}
                        labelStyle={{ padding: 0, position: 'absolute', left: "auto", margin: 0 }}
                        contentStyle={{ height: 25 }}
                        mode="outlined"
                        compact={true}
                    >
                        <Text style={{ fontSize: 9 }}>Physical</Text>
                    </Button>
                    <Button
                        labelStyle={{ padding: 0, position: 'absolute', left: "auto", margin: 0 }}
                        contentStyle={{ height: 25 }}
                        style={styles.filterButton}
                        mode='outlined'
                        compact={true}
                    >
                        <Text style={{ fontSize: 9 }}>Emotional</Text>
                    </Button>
                    <Button
                        labelStyle={{ padding: 0, position: 'absolute', left: "auto", margin: 0 }}
                        contentStyle={{ height: 25 }}
                        style={styles.filterButton}
                        mode='outlined'
                    >
                        <Text style={{ fontSize: 9 }}>Sexual violence</Text>
                    </Button>
                </View  >
                <PostsList />
            </SearchBarContextProvider>
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
        height: 40
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
        width: "100%",
        bottom: 0,
        left: 0,
        borderRadius: 10,
        position: 'absolute',
    },
});