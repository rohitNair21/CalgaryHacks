import React, { useCallback, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Linking, TouchableOpacity, ScrollView, NativeSyntheticEvent, NativeScrollEvent, Modal, Image } from 'react-native';
import { Link, useNavigation } from 'expo-router';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { Colors } from '@/constants/Colors';

interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  description?: string;
  address?: string;
}

const emergencyContacts: EmergencyContact[] = [
  {
    id: '1',
    name: 'Emergency Services',
    number: '911',
    description: 'For immediate danger or life-threatening situations'
  },
  {
    id: '2',
    name: 'Domestic Violence Support',
    number: '403-266-4357',
    description: '24/7 support for those experiencing abuse'
  },
  {
    id: '3',
    name: 'Sexual Crisis Line',
    number: '403-234-7233',
    description: 'Discreet crisis counseling via text message'
  },
  {
    id: '4',
    name: 'Suicide Prevention',
    number: '1-855-443-5722',
    description: '24/7 confidential support in over 170 languages',
  },
  {
    id: '5',
    name: 'Downtown Help Center',
    number: '403-266-4357',
    description: 'Emergency shelter and support services',
    address: '123 Downtown Drive, Calgary, AB'
  },
  {
    id: '6',
    name: 'Downtown Help Center',
    number: '403-266-4357',
    description: 'Legal assistance and victim advocacy services',
    address: '456 Beltline Road, Calgary, AB'
  },
  {
    id: '7',
    name: 'Survivor Support Network',
    number: '403-266-4357',
    description: 'Peer support and long-term recovery resources',
    address: '789 Inglewood Ave, Calgary, AB'
  },
  {
    id: '8',
    name: 'Trevor Project LGBTQ Youth',
    number: '1-866-488-7386',
    description: '24/7 crisis support for LGBTQ young people',
    address: 'West Hollywood, CA'
  },
  {
    id: '9',
    name: 'National Sexual Assault Hotline',
    number: '1-800-656-4673',
    description: 'Confidential 24/7 support for sexual assault survivors',
    address: 'Downtown Washington DC'
  }
];

// Update Article interface to include content
interface Article {
  id: string;
  title: string;
  source: string;
  content: string; // Changed from url to content
}

// Update article data with content
const articles: Article[] = [
  {
    id: '1',
    title: 'Understanding Domestic Violence',
    source: 'National Domestic Violence Hotline',
    content: 'Domestic violence includes behaviors used by one person in a relationship to control another. This can include:\n\n• Physical abuse\n• Emotional abuse\n• Verbal abuse\n• Financial control\n• Digital abuse\n• Isolation tactics\n\nIt\'s important to know that abuse is never your fault, and help is available. Everyone deserves to feel safe and respected in their relationships.'
  },
  {
    id: '2',
    title: 'Safety Planning Guide',
    source: 'Women\'s Law Initiative',
    content: 'A safety plan is a personalized plan that can help you stay safe while in a difficult situation.\n\nKey elements of a safety plan:\n\n• Keep important documents in a safe place\n• Save emergency numbers in a secure way\n• Identify safe exits in your home\n• Choose a code word with trusted friends\n• Plan where you would go in an emergency\n• Pack an emergency bag if possible\n\nRemember: Your safety is the top priority. Update your plan as your situation changes.'
  },
  {
    id: '3',
    title: 'Supporting a Loved One',
    source: 'RAINN',
    content: 'If someone you know is experiencing abuse, you can help by:\n\n• Listening without judgment\n• Believing their experiences\n• Respecting their choices\n• Helping them find resources\n• Being patient - leaving takes time\n• Maintaining their privacy\n• Staying connected\n\nRemember that the survivor is the expert in their own life. Support their decisions, even if you don\'t understand them.'
  }
];

// Add Modal component
const ArticleModal = ({ 
  article, 
  visible, 
  onClose 
}: { 
  article: Article | null; 
  visible: boolean; 
  onClose: () => void;
}) => {
  if (!article) return null;
  
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{article.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <IconSymbol size={24} name="xmark.circle.fill" color={Colors.text.secondary} />
            </TouchableOpacity>
          </View>
          <Text style={styles.modalSource}>{article.source}</Text>
          <ScrollView style={styles.modalBody}>
            <Text style={styles.modalText}>{article.content}</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default function ResourcesScreen() {
  const navigation = useNavigation();
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);
  
  const handleScroll = useCallback(({ nativeEvent }: NativeSyntheticEvent<NativeScrollEvent>) => {
    const { contentOffset, contentSize, layoutMeasurement } = nativeEvent;
    const isScrollingDown = contentOffset.y > 0;
    
    // @ts-ignore - setTabBarHidden exists but isn't in the type definitions
    navigation.setOptions({ tabBarHidden: isScrollingDown });
  }, [navigation]);

  const openMaps = (address: string) => {
    const encodedAddress = encodeURIComponent(address);
    const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodedAddress}`;
    Linking.openURL(mapsUrl);
  };

  const openUrl = (url: string) => {
    Linking.openURL(url);
  };

  const openPhone = (number: string) => {
    const phoneNumber = number.replace(/[^0-9]/g, ''); // Remove non-numeric characters
    Linking.openURL(`tel:${phoneNumber}`);
  };

  const renderEmergencyContacts = () => (
    <>
      {emergencyContacts.slice(0, 7).map((item, index) => (
        <React.Fragment key={item.id}>
          {index === 4 && (
            <Text style={styles.sectionHeader}>Help Centers</Text>
          )}
          <View style={styles.contactCard}>
            <View style={styles.contactHeader}>
              <Text style={styles.contactName}>{item.name}</Text>
              <TouchableOpacity 
                onPress={() => openPhone(item.number)}
                style={styles.phoneButton}
              >
                <IconSymbol size={42} name="phone.circle.fill" color={Colors.primary} />
              </TouchableOpacity>
            </View>
            <Text style={styles.contactNumber}>{item.number}</Text>
            {item.description && (
              <Text style={styles.contactDescription}>{item.description}</Text>
            )}
            {item.address && (
              <TouchableOpacity onPress={() => openMaps(item.address!)}>
                <View style={styles.mapLinkContainer}>
                  <Text style={styles.mapLink}>Find on Google Maps</Text>
                  <IconSymbol size={14} name="arrow.right" color={Colors.link} />
                </View>
              </TouchableOpacity>
            )}
          </View>
        </React.Fragment>
      ))}
    </>
  );

  const renderArticles = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.articleList}
    >
      {articles.map(item => (
        <TouchableOpacity 
          key={item.id}
          style={styles.articleCard} 
          onPress={() => setSelectedArticle(item)}
        >
          <View style={styles.articleHeader}>
            <Text style={styles.articleTitle}>{item.title}</Text>
          </View>
          <Text style={styles.articleSource}>{item.source}</Text>
          <TouchableOpacity 
            style={styles.readButton}
            onPress={() => setSelectedArticle(item)}
          >
            <Text style={styles.readButtonText}>Read Now</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );

  const renderDisclaimer = () => (
    <View style={styles.disclaimerContainer}>
      <View style={styles.disclaimerHeader}>
        <IconSymbol size={24} name="exclamationmark.triangle.fill" color={Colors.warning} />
        <Text style={styles.disclaimerTitle}>Important Notice</Text>
      </View>
      <Text style={styles.disclaimerText}>
        If you are in immediate danger, call emergency services. If you feel your device is being monitored, please access these resources from a safe device. Your safety is the top priority. These resources are confidential, but always trust your instincts if you feel unsafe.
      </Text>
    </View>
  );

  return (
    <>
      <ScrollView 
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <View style={styles.imageContainer}>
          <Image 
            source={require('@/assets/images/wallhaven-p266lm.png')}
            style={styles.headerImage}
          />
          <View style={styles.imageOverlay}>
            <Text style={styles.imageTitle}>Know where to find help</Text>
            <Text style={styles.imageSubtitle}>
              Find helplines to reach out to, shelters, and articles to guide you
            </Text>
          </View>
        </View>
        <Text style={styles.mainHeader}>Helpful Resources</Text>
        {renderDisclaimer()}
        <Text style={styles.header}>Get Assistance</Text>
        {renderEmergencyContacts()}
        <Text style={styles.sectionHeader}>Learn More</Text>
        {renderArticles()}
      </ScrollView>
      <ArticleModal
        article={selectedArticle}
        visible={!!selectedArticle}
        onClose={() => setSelectedArticle(null)}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
  },
  listContainer: {
    padding: 16,
  },
  contactCard: {
    backgroundColor: Colors.card.pink,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    marginHorizontal: 16,
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
    justifyContent: 'space-between',
  },
  contactName: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 8,
  },
  contactNumber: {
    fontSize: 16,
    color: Colors.link,
    marginBottom: 4,
  },
  contactDescription: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  sectionHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 16,
    color: Colors.text.primary,
    paddingHorizontal: 16,
  },
  iconContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  icon: {
    marginLeft: 8,
  },
  articleList: {
    paddingLeft: 16,
    paddingRight: 16,
  },
  articleCard: {
    backgroundColor: Colors.card.pink,
    padding: 16,
    borderRadius: 12,
    marginRight: 12,
    width: 280,
    justifyContent: 'space-between',
  },
  articleHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  articleTitle: {
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
    marginRight: 8,
  },
  articleSource: {
    fontSize: 14,
    color: Colors.text.secondary,
  },
  contentContainer: {
    paddingBottom: 80,
  },
  readButton: {
    backgroundColor: Colors.primary,
    padding: 12,
    borderRadius: 8,
    marginTop: 12,
    alignItems: 'center',
  },
  readButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  disclaimerContainer: {
    backgroundColor: Colors.card.warning,
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 24,
  },
  disclaimerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  disclaimerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.warning,
  },
  disclaimerText: {
    fontSize: 14,
    lineHeight: 20,
    color: Colors.text.secondary,
  },
  mapLinkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  mapLink: {
    color: Colors.link,
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay.modal,
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    minHeight: '80%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    marginRight: 16,
  },
  modalSource: {
    fontSize: 16,
    color: Colors.text.secondary,
    marginBottom: 16,
  },
  modalBody: {
    flex: 1,
  },
  modalText: {
    fontSize: 16,
    lineHeight: 24,
    color: Colors.text.primary,
  },
  phoneButton: {
    paddingTop: 4,
  },
  mainHeader: {
    fontSize: 28,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  headerImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  imageContainer: {
    position: 'relative',
    height: 200,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
    marginHorizontal: 0,
  },
  imageOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.overlay.dark,
  },
  imageTitle: {
    color: Colors.background,
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    padding: 16,
  },
  imageSubtitle: {
    color: Colors.background,
    fontSize: 16,
    textAlign: 'center',
    paddingHorizontal: 16,
    opacity: 0.9,
  },
}); 