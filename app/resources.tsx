import { View, Text, ScrollView, Linking, TouchableOpacity, Modal, Pressable, Image } from "react-native";
import { resourcesStyles as styles } from './resources.styles';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';

// Define an interface for article data
interface Article {
  title: string;
  icon: string;
  image: string;
  description: string;
  content: string;
}

const openLink = (url: string) => {
  Linking.openURL(url);
};

export default function Resources() {
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  const articles: Article[] = [
    {
      title: "Understanding Mental Health",
      icon: "📖",
      image: "https://example.com/mental-health.jpg",
      description: "Learn about the basics of mental health and well-being.",
      content: `Mental health is a crucial part of our overall well-being that affects every aspect of our lives. Just as physical health requires attention and care, our mental health needs the same level of understanding and nurturing.

      Our mental well-being influences how we think, feel, and behave in daily life. It impacts our ability to cope with stress, overcome challenges, build relationships, and recover from life's setbacks and hardships.

      Good mental health isn't just the absence of mental health problems. It's about having the tools and support to face life's challenges effectively. This includes maintaining balanced relationships, staying physically active, engaging in meaningful activities, and developing resilience.

      Many people face mental health challenges at some point in their lives. It's important to remember that seeking help is not a sign of weakness, but rather a step toward better health and well-being. Professional support, combined with self-care practices, can make a significant difference in managing mental health effectively.

      Remember: Your mental health matters, and taking care of it is just as important as maintaining your physical health. Don't hesitate to reach out for help when you need it.`
    },
    {
      title: "Coping with Anxiety",
      icon: "🧘‍♀️",
      image: "https://example.com/anxiety.jpg",
      description: "Practical techniques for managing anxiety and stress.",
      content: `Anxiety is a natural response to stress, but when it becomes overwhelming, it can significantly impact our daily lives. Understanding and managing anxiety is key to maintaining good mental health.

      Everyone experiences anxiety differently, but common symptoms include racing thoughts, physical tension, and difficulty concentrating. These feelings are normal and manageable with the right tools and support.

      There are several effective strategies for managing anxiety. Deep breathing exercises can help calm your nervous system when feeling overwhelmed. Regular physical exercise releases endorphins and reduces stress hormones. Mindfulness meditation helps ground you in the present moment, reducing worry about the future.

      Creating a routine that includes regular sleep patterns, balanced nutrition, and limited caffeine intake can also help manage anxiety levels. It's important to recognize that some days will be more challenging than others, and that's perfectly normal.

      If anxiety is significantly affecting your daily life, professional help is available and effective. Therapists can provide specialized techniques and support tailored to your specific needs. Remember, seeking help is a sign of strength, not weakness.`
    },
    {
      title: "Supporting Loved Ones",
      icon: "❤️",
      image: "https://example.com/supporting-loved-ones.jpg",
      description: "How to help friends and family through difficult times.",
      content: `Supporting someone going through a tough time can make a real difference. 
               Here's how you can help:

               • Listen without judgment
               • Validate their feelings
               • Offer practical support
               • Stay in regular contact
               • Know the warning signs
               • Help them find professional support
               
               Remember to also take care of yourself while supporting others.`
    },
    {
      title: "Self-Care Basics",
      icon: "🌟",
      image: "https://example.com/self-care-basics.jpg",
      description: "Essential self-care practices for mental well-being.",
      content: `Self-care isn't selfish - it's necessary for maintaining good mental health.
               Key aspects of self-care include:

               • Getting enough sleep
               • Eating nutritious foods
               • Regular exercise
               • Setting boundaries
               • Taking breaks when needed
               • Engaging in enjoyable activities
               
               Make self-care a priority in your daily routine.`
    },
    {
      title: "Recognizing Warning Signs",
      icon: "⚠️",
      image: "https://example.com/recognizing-warning-signs.jpg",
      description: "Learn to identify mental health warning signs.",
      content: `Being able to recognize warning signs in yourself or others is crucial.
               Common warning signs include:

               • Changes in sleep patterns
               • Loss of interest in activities
               • Withdrawal from social connections
               • Changes in appetite
               • Difficulty concentrating
               • Unexplained physical symptoms
               
               If you notice these signs, reach out for professional help.`
    },
    {
      title: "Building Resilience",
      icon: "💪",
      image: "https://example.com/building-resilience.jpg",
      description: "Strengthen your ability to cope with life's challenges.",
      content: `Resilience is the ability to bounce back from difficulties.
               Ways to build resilience:

               • Develop a strong support network
               • Maintain a positive outlook
               • Accept that change is part of life
               • Set realistic goals
               • Take decisive actions
               • Look for opportunities for self-discovery
               
               Resilience can be developed and strengthened over time.`
    }
  ];

  const ArticleModal = () => (
    <Modal
      animationType="slide"
      transparent={true}
      visible={selectedArticle !== null}
      onRequestClose={() => setSelectedArticle(null)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <View style={styles.modalTitleContainer}>
              <Text style={styles.modalTitle}>
                <Text>{selectedArticle?.icon} </Text>
                {selectedArticle?.title}
              </Text>
              {selectedArticle?.image && (
                <Image 
                  source={{ uri: selectedArticle.image }} 
                  style={styles.modalImage}
                />
              )}
            </View>
            <Pressable 
              onPress={() => setSelectedArticle(null)}
              style={styles.closeButton}
            >
              <FontAwesome name="times" size={24} color="#666" />
            </Pressable>
          </View>
          <ScrollView style={styles.modalBody}>
            <Text style={styles.modalText}>
              {selectedArticle?.content.split('\n\n').map((paragraph, index) => (
                <Text key={index}>
                  {paragraph.trim()}{'\n\n'}
                </Text>
              ))}
            </Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView 
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={true}
      bounces={true}
      overScrollMode="always"
    >
      <Text style={styles.title}>Helpful Resources</Text>

      {/* Disclaimer Section */}
      <View style={styles.disclaimerContainer}>
        <Text style={styles.disclaimerTitle}>Important Notice</Text>
        <Text style={styles.disclaimerText}>
          If you are experiencing a life-threatening emergency, immediately dial 911 or your local emergency services.
        </Text>
      </View>

      {/* Emergency Contacts */}
      <Text style={styles.sectionTitle}>Emergency</Text>
      <TouchableOpacity style={styles.linkContainer}>
        <View style={styles.phoneRow}>
          <View style={styles.phoneContainer}>
            <Text style={styles.phoneLabel}>
              <Text style={styles.icon}>🚨</Text> Emergency Services
            </Text>
            <Text style={styles.phoneNumber}>911</Text>
          </View>
          <TouchableOpacity 
            style={styles.dialButton}
            onPress={() => openLink('tel:911')}
          >
            <FontAwesome name="phone" style={styles.dialIcon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Immediate Help */}
      <Text style={styles.sectionTitle}>Immediate Help</Text>
      <TouchableOpacity style={styles.linkContainer}>
        <View style={styles.phoneRow}>
          <View style={styles.phoneContainer}>
            <Text style={styles.phoneLabel}>
              <Text style={styles.icon}>🏥</Text> Suicide and Self Harm
            </Text>
            <Text style={styles.phoneNumber}>1-111-111-1111</Text>
          </View>
          <TouchableOpacity 
            style={styles.dialButton}
            onPress={() => openLink('tel:+1-111-111-1111')}
          >
            <FontAwesome name="phone" style={styles.dialIcon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkContainer}>
        <View style={styles.phoneRow}>
          <View style={styles.phoneContainer}>
            <Text style={styles.phoneLabel}>
              <Text style={styles.icon}>💝</Text> Mental Health Hotline
            </Text>
            <Text style={styles.phoneNumber}>1-111-111-1111</Text>
          </View>
          <TouchableOpacity 
            style={styles.dialButton}
            onPress={() => openLink('tel:+1-111-111-1111')}
          >
            <FontAwesome name="phone" style={styles.dialIcon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkContainer}>
        <View style={styles.phoneRow}>
          <View style={styles.phoneContainer}>
            <Text style={styles.phoneLabel}>
              <Text style={styles.icon}>💝</Text> Sexual Assault Hotline
            </Text>
            <Text style={styles.phoneNumber}>1-111-111-1111</Text>
          </View>
          <TouchableOpacity 
            style={styles.dialButton}
            onPress={() => openLink('tel:+1-111-111-1111')}
          >
            <FontAwesome name="phone" style={styles.dialIcon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkContainer}>
        <View style={styles.phoneRow}>
          <View style={styles.phoneContainer}>
            <Text style={styles.phoneLabel}>
              <Text style={styles.icon}>📞</Text> Family Violence Hotline
            </Text>
            <Text style={styles.phoneNumber}>1-111-111-1111</Text>
          </View>
          <TouchableOpacity 
            style={styles.dialButton}
            onPress={() => openLink('tel:+1-111-111-1111')}
          >
            <FontAwesome name="phone" style={styles.dialIcon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkContainer}>
        <View style={styles.phoneRow}>
          <View style={styles.phoneContainer}>
            <Text style={styles.phoneLabel}>
              <Text style={styles.icon}>🔧</Text> Technical Help
            </Text>
            <Text style={styles.phoneNumber}>1-111-111-1111</Text>
          </View>
          <TouchableOpacity 
            style={styles.dialButton}
            onPress={() => openLink('tel:+1-111-111-1111')}
          >
            <FontAwesome name="phone" style={styles.dialIcon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkContainer}>
        <View style={styles.phoneRow}>
          <View style={styles.phoneContainer}>
            <Text style={styles.phoneLabel}>
              <Text style={styles.icon}>👤</Text> Account Support
            </Text>
            <Text style={styles.phoneNumber}>1-111-111-1111</Text>
          </View>
          <TouchableOpacity 
            style={styles.dialButton}
            onPress={() => openLink('tel:+1-111-111-1111')}
          >
            <FontAwesome name="phone" style={styles.dialIcon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.linkContainer}>
        <View style={styles.phoneRow}>
          <View style={styles.phoneContainer}>
            <Text style={styles.phoneLabel}>
              <Text style={styles.icon}>💬</Text> General Inquiries
            </Text>
            <Text style={styles.phoneNumber}>1-111-111-1111</Text>
          </View>
          <TouchableOpacity 
            style={styles.dialButton}
            onPress={() => openLink('tel:+1-111-111-1111')}
          >
            <FontAwesome name="phone" style={styles.dialIcon} />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      {/* Articles section */}
      <Text style={styles.sectionTitle}>Helpful Articles</Text>
      <ScrollView 
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.articleScrollContainer}
      >
        {articles.map((article, index) => (
          <View key={index} style={styles.articleContainer}>
            <View style={styles.articleContent}>
              <Text style={styles.articleTitle}>
                <Text style={styles.icon}>{article.icon}</Text> {article.title}
              </Text>
              <Text style={styles.articleDescription}>
                {article.description}
              </Text>
            </View>
            <TouchableOpacity 
              style={styles.readNowButton}
              onPress={() => setSelectedArticle(article)}
            >
              <Text style={styles.readNowText}>Read Now</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <ArticleModal />
    </ScrollView>
  );
}

