import { Text, View, TouchableOpacity, Dimensions } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={{ flex: 1 }}>

      {/* Bottom Navbar */}
      <View style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 20,
        paddingBottom: 40, // Add extra padding for bottom safe area
      }}>
        <TouchableOpacity>
          <Link href="/resources">
            <View style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              alignItems: 'center',
              padding: 15,
              backgroundColor: '#007AFF',
              borderRadius: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
              width: '100%',

            }}>
              <Text style={{ color: 'white', fontSize: 18 }}>📚 Resources</Text>
            </View>
          </Link>
        </TouchableOpacity>
      </View>
    </View>
  );
}
