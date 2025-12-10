import { readUserProfile } from '@/_backend/api/profile';
import { getMechanicById, getReviewsByMechanic } from '@/_backend/api/review';
import NormalButton from '@/app/components/NormalButton';
import ShopManager from '@/app/components/ShopManager';
import Star from '@/app/components/Star';
import TimeConverter from '@/app/components/TimeConverter';
import ToggleButton from '@/app/components/ToggleButton';
import ViewReviews from '@/app/components/ViewReviews';
import { icons } from '@/constants/icons';
import { images } from '@/constants/images';
import { fetchUserAttributes, getCurrentUser } from 'aws-amplify/auth';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  DimensionValue,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Linking,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { ReactNativeModal as Modal } from 'react-native-modal';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StarRatingDisplay } from 'react-native-star-rating-widget';
import { Float } from 'react-native/Libraries/Types/CodegenTypesNamespace';

const Details = () => {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [mechanic, setMechanic] = useState<any>(null);
  const [reviews, setReviews] = useState<any[]>([]);
  const [reviewAVG, setreviewAVG] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [more, setMore] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [userID, setUserID] = useState('');
  const [firstName, setFirstName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const displayName =
    firstName || lastName ? `${firstName} ${lastName}`.trim() : null;
  const [hours, setHours] = useState<Record<string, string>>();

  useEffect(() => {
    (async () => {
      try {
        const { userId } = await getCurrentUser();
        const attrs = await fetchUserAttributes();
        const email = attrs.email;
        if (!email) {
          throw new Error(
            'No email on the Cognito profile (check pool/app-client readable attributes).'
          );
        }

        const userData = await readUserProfile(userId, email);
        setIsAuthenticated(attrs.userType == 'Mechanic');
        setFirstName(userData.firstName ?? '');
        setLastName(userData.lastName ?? '');
        setIsAuthenticated(true);
      } catch (e: any) {
        console.log('Details: Error loading user data:', e);
        console.log('Details: Error message:', e?.message);
        setFirstName('');
        setLastName('');
        setIsAuthenticated(false);
      }
    })();
  }, []);

  const [query, setQuery] = useState('');
  const [visible, setVisible] = useState(false);
  const [Verified, setVerified] = useState(false);
  const [choice, setChoice] = useState('');
  const [choice2, setChoice2] = useState('');
  const [isClaimed, setClaimed] = useState(false); // change to fetch query
  const [asMechanic, setAsMechanic] = useState(true); // for testing
  const [claimVisibile, setClaimVisibile] = useState(false);
  const [claimLoading, setClaimLoading] = useState(true);
  const [editVisible, setEditVisible] = useState(false);

  const handleChoice = (
    flag: boolean,
    choice: string,
    setter: React.Dispatch<React.SetStateAction<string>>
  ) => {
    if (flag) {
      setter(choice);
    } else {
      setter('');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) {
        setMechanic(null);
        setReviews([]);
        setreviewAVG(0);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // 1. Mechanic details
        console.log('id', id);
        const mech = await getMechanicById(String(id));
        setMechanic(mech as any);

        if (mech) {
          setHours({
            Mon: mech.Hours[0],
            Tues: mech.Hours[1],
            Weds: mech.Hours[2],
            Thurs: mech.Hours[3],
            Fri: mech.Hours[4],
            Sat: mech.Hours[5],
            Sun: mech.Hours[6],
          });
        }

        // 2. Reviews for this mechanic
        const { reviews: backendReviews, average } = await getReviewsByMechanic(
          String(id)
        );

        console.log(
          'Raw backendReviews from Lambda:',
          JSON.stringify(backendReviews, null, 2)
        );

        setReviews(
          backendReviews.map((r: any) => ({
            ReviewId: r.ReviewId ?? r.reviewId,
            MechanicId: r.MechanicId ?? r.mechanicId,
            Rating: Number(r.Rating ?? r.rating ?? 0),
            Review: r.Review ?? r.review ?? '',
            UserId: r.UserId ?? r.userId,
            CreatedAt: r.CreatedAt ?? r.createdAt,
          }))
        );

        if (backendReviews.length > 0) {
          // Prefer backend average, fallback to computed
          const avg =
            typeof average === 'number' && !Number.isNaN(average)
              ? average
              : backendReviews.reduce(
                  (acc: number, r: any) =>
                    acc + Number(r.Rating ?? r.rating ?? 0),
                  0
                ) / backendReviews.length;

          setreviewAVG(avg as Float);
        } else {
          setreviewAVG(0);
        }
      } catch (error) {
        console.error('Error loading mechanic/reviews:', error);
        setMechanic(null);
        setReviews([]);
        setreviewAVG(0);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // temporary for testing
  const claim = async () => {
    setTimeout(() => {
      let temp = Math.random();
      setClaimed(temp < 0.5);
      setClaimLoading(false);
    }, 5000);
  };

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (!mechanic) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>{id} could not be found</Text>
      </View>
    );
  } else {
    const rawServices = mechanic?.Services;

    const servicesData = Array.isArray(rawServices)
      ? rawServices.map((item: string) => item.trim())
      : typeof rawServices === 'string'
      ? rawServices.split(',').map((item: string) => item.trim())
      : [];

    const condition =
      (mechanic.Hours?.length ?? 0) > 0 ||
      mechanic.address !== '' ||
      mechanic.Website !== '' ||
      mechanic.Phone !== '';

    // Histogram buckets
    const temp = reviews.reduce(
      (acc, curr) => {
        const ratingNum = Number(curr.Rating ?? 0);
        const val = String(Math.round(ratingNum));
        acc[val] = (acc[val] || 0) + 1;
        return acc;
      },
      { '1': 0, '2': 0, '3': 0, '4': 0, '5': 0 } as Record<string, number>
    );

    const sortedTemp = Object.keys(temp)
      .sort((a, b) => Number(b) - Number(a))
      .reduce((acc, key) => {
        acc[key] = temp[key];
        return acc;
      }, {} as Record<string, number>);

    // Search filter
    const searchReviews =
      query != ''
        ? reviews.filter((x) =>
            x.Review.toLowerCase().includes(query.toLowerCase())
          )
        : reviews;

    const applyFilter = () => {
      let temp = searchReviews;
      if (choice2 != '') {
        const today = new Date();
        const cat = new Date(
          today.setDate(
            today.getDate() -
              (choice2 == '1' ? 30 : choice2 == '2' ? 14 : 7)
          )
        );
        temp = temp.filter(
          (x) => x.CreatedAt && new Date(x.CreatedAt) >= cat
        );
      }

      if (choice == '') {
        return temp;
      } else if (choice == '5') return temp.filter((x) => x.Rating == Number(choice));
      else {
        const bound = Number(choice);
        return temp.filter(
          (x) => bound <= x.Rating && x.Rating < bound + 1
        );
      }
    };

    return (
      // <SafeAreaView className='flex-1 bg-subheaderGray' edges={['right', 'bottom','left']}>
      <KeyboardAvoidingView
        className="flex-1"
        behavior="padding"
        keyboardVerticalOffset={100}
      >
        <ScrollView
          contentContainerStyle={{ paddingBottom: 50, gap: 10 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="w-full bg-white flex-row px-5 py-7 gap-8">
            {!mechanic.Image ? (
              <images.defaultImage width={120} height={120} />
            ) : (
              <Image
                source={{ uri: String(mechanic.Image) }}
                className="w-[120] h-[120]"
              />
            )}
            <View className="flex-1 flex-col">
              <Text className="mediumTitle mb-[6]">{mechanic.name}</Text>
              <View className="flex-row">
                <Text className="smallTextBold">Ratings: </Text>
                <StarRatingDisplay
                  color={'black'}
                  starSize={20}
                  StarIconComponent={Star}
                  rating={reviewAVG}
                  starStyle={{ marginHorizontal: -1 }}
                />
              </View>
              <Text className="smallTextBold mb-[6]">
                Reviews: {reviews.length}
              </Text>
              {isAuthenticated && asMechanic && (
                <Pressable
                  onPress={async () => {
                    /**
                     * PseudoCode
                     * if Claimed
                     *    prompt for confirmation modal
                     *    return
                     *
                     * call modal
                     * call async func for claiming
                     */
                    if (!isClaimed) {
                      setClaimVisibile(true);
                      await claim();
                    }
                  }}
                >
                  <Text className="buttonTextBlue underline">
                    {isClaimed ? 'Claimed' : 'Claim Business'}
                  </Text>
                </Pressable>
              )}
            </View>
            <View style={{ marginTop: 30, marginLeft: 15, gap: 10 }}>
              {mechanic.Certified && (
                <images.badge width={30} height={30} />
              )}
            </View>
            {isClaimed && (
              <TouchableOpacity onPress={() => setEditVisible(true)}>
                <icons.editIcon
                  style={{ height: 50, width: 50, marginTop: 10 }}
                />
              </TouchableOpacity>
            )}
          </View>

          <View className="mx-5 gap-3.5">
            <View className="w-full bg-white rounded-xl self-center px-5 pt-3.5 gap-2">
              <Text className="smallTitle"> Services</Text>
              <FlatList
                className="mx-[5%] mb-[5%]"
                data={more ? servicesData : servicesData.slice(0, 8)}
                renderItem={({ item }) => (
                  <Text className="flex-1 smallTextBlue">
                    {'\u2022'} {item}
                  </Text>
                )}
                numColumns={2}
                initialNumToRender={2}
                scrollEnabled={false}
                columnWrapperClassName="gap-20 "
                contentContainerClassName="gap-2"
                showsVerticalScrollIndicator={false}
              />
              {!more && servicesData.length > 8 && (
                <Text
                  className="text-lightBlueText bold text-center"
                  onPress={() => {
                    setMore(true);
                  }}
                >
                  show more...
                </Text>
              )}
              {more && servicesData.length > 8 && (
                <Text
                  className="text-lightBlueText text-center"
                  onPress={() => {
                    setMore(false);
                  }}
                >
                  show ...
                </Text>
              )}
            </View>

            {condition && (
              <View className="w-full bg-white rounded-xl self-center px-5 py-3.5 gap-2">
                <Text className="smallTitle">Additional Details</Text>
                <View className="mx-[5%]">
                  {mechanic.Website != '' && (
                    <Text className="smallTextBlue mb-[2%]">
                      {'\u2022'} Website:{' '}
                      <Text className="buttonTextBlue">
                        {mechanic.Website}
                      </Text>
                    </Text>
                  )}
                  {mechanic.Phone != '' && (
                    <Text className="smallTextBlue mb-[2%]">
                      {'\u2022'} Phone:{' '}
                      <Text className="buttonTextBlue">
                        {mechanic.Phone}
                      </Text>
                    </Text>
                  )}
                  {mechanic.address != '' && (
                    <View className="flex-row justify-between items-center">
                      <View className="w-[80%]">
                        <Text className="smallTextBlue mb-[2%]">
                          {'\u2022'} Address:{' '}
                          <Text className="buttonTextBlue">
                            {mechanic.address}{' '}
                          </Text>
                        </Text>
                      </View>
                      {mechanic.Location && (
                        <Pressable
                          onPress={() =>
                            Linking.openURL(
                              `https://google.com/maps/search/?api=1&query=${mechanic.Location[0]},${mechanic.Location[1]}&force_browser=true`
                            )
                          }
                        >
                          <icons.start width={20} height={20} />
                        </Pressable>
                      )}
                    </View>
                  )}
                  {mechanic.Hours.length > 0 && (
                    <>
                      <Text className="smallTextBlue mb-[2%]">
                        {'\u2022'} Hours
                      </Text>
                      <View className="mx-[5%] w-[75%]">
                        {hours &&
                          Object.keys(hours).map((x) => (
                            <View
                              key={x}
                              className="flex-row justify-between mb-[2%]"
                            >
                              <Text className="buttonTextBlue">{x}</Text>
                              <Text className="buttonTextBlue">
                                {TimeConverter(hours[x])}
                              </Text>
                            </View>
                          ))}
                      </View>
                    </>
                  )}
                </View>
              </View>
            )}
            <View className="w-full bg-white rounded-xl self-center py-8 gap-2 flex-row">
              <View className="items-center w-[30%] ml-[10%] gap-2">
                <Text className="text-center smallTextBold">
                  {isAuthenticated
                    ? `${displayName || 'no_name'}`
                    : 'Want to add a review?'}
                </Text>
                <StarRatingDisplay
                  rating={0}
                  StarIconComponent={Star}
                  color="black"
                  starSize={20}
                />
              </View>
              <View className="flex-1 justify-center">
                <NormalButton
                  text={isAuthenticated ? 'Post a review' : 'Log in'}
                  onClick={() => {
                    if (!isAuthenticated) {
                      router.push('/profile');
                      return;
                    }

                    router.push({
                      pathname: '/mechanic/[id]/createReview',
                      params: { id },
                    });
                  }}
                />
              </View>
            </View>

            <View className="w-full bg-white rounded-xl self-center px-5 py-3.5 gap-2 flex-row">
              <View className="items-center justify-center gap-[5] mx-[10]">
                <Text className="buttonTextBlack text-2xl">
                  {reviewAVG ? reviewAVG.toFixed(1) : 0}
                </Text>
                <StarRatingDisplay
                  rating={reviewAVG}
                  color="black"
                  StarIconComponent={Star}
                  starSize={18}
                />
                <Text className="smallTextBlack">
                  {reviews.length} reviews
                </Text>
              </View>
              <View className="items-center justify-center flex-1 mr-[2%]">
                {Object.keys(sortedTemp)
                  .reverse()
                  .map((x) => {
                    const percent =
                      reviews.length > 0
                        ? (sortedTemp[x] / reviews.length) * 100
                        : 0;
                    return (
                      <View
                        key={x}
                        className=" w-full mb-[2%] flex-row justify-center items-center gap-1"
                      >
                        <Text className="buttonTextBlack">{x}</Text>
                        <View className="bg-stroke rounded-full w-full  flex-row h-[7]">
                          <Text
                            className="bg-primaryBlue rounded-full"
                            style={{
                              width: `${percent}%` as DimensionValue,
                            }}
                          >
                            {' '}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
              </View>
            </View>

            {/* Search + Filter trigger */}
            <View className="w-full bg-white rounded-xl self-center px-5 py-3.5 gap-2 flex-row justify-between">
              <View className="flex-row border border-stroke rounded-full bg-white items-center ">
                <icons.search />
                <TextInput
                  className="w-[50%] text-center"
                  value={query}
                  onChangeText={(newf) => {
                    setQuery(newf);
                  }}
                  placeholder="Search reviews"
                />
              </View>
              <NormalButton
                text="Filter"
                onClick={() => {
                  setVisible(true);
                }}
              />
            </View>

            {/* Inline Filter Bubble (replaces modal) */}
            {visible && (
              <View className="w-full bg-white rounded-xl self-center px-5 py-3.5 gap-4">
                <View className="flex-row justify-between items-center">
                  <Text className="buttonTextBlack text-lg">Filters</Text>
                  <Pressable onPress={() => setVisible(false)}>
                    <Text className="buttonTextBlack text-xl">✕</Text>
                  </Pressable>
                </View>

                <ToggleButton
                  flag={Verified}
                  onPress={(newf) => {
                    setVerified(newf);
                  }}
                  text="Verified"
                />

                <View className="flex-row w-full items-center">
                  <Text className="buttonTextBlack text-xl ml-1 mr-5">Ratings</Text>
                  <View className="w-full border-t border-stroke" />
                </View>

                <View className="flex-row flex-wrap justify-between gap-2">
                  <View className="w-[48%]">
                    <ToggleButton
                      flag={choice == '5'}
                      width={'100%'}
                      onPress={(newf) => {
                        handleChoice(newf, '5', setChoice);
                      }}
                      text="5 stars"
                    />
                  </View>

                  <View className="w-[48%]">
                    <ToggleButton
                      flag={choice == '4'}
                      width={'100%'}
                      onPress={(newf) => {
                        handleChoice(newf, '4', setChoice);
                      }}
                      text="4 stars"
                    />
                  </View>

                  <View className="w-[48%]">
                    <ToggleButton
                      flag={choice == '3'}
                      width={'100%'}
                      onPress={(newf) => {
                        handleChoice(newf, '3', setChoice);
                      }}
                      text="3 stars"
                    />
                  </View>

                  <View className="w-[48%]">
                    <ToggleButton
                      flag={choice == '2'}
                      width={'100%'}
                      onPress={(newf) => {
                        handleChoice(newf, '2', setChoice);
                      }}
                      text="2 stars"
                    />
                  </View>

                  <View className="w-[48%]">
                    <ToggleButton
                      flag={choice == '1'}
                      width={'100%'}
                      onPress={(newf) => {
                        handleChoice(newf, '1', setChoice);
                      }}
                      text="1 star"
                    />
                  </View>
                </View>
                <View className="flex-row w-full items-center mb-[-5] mt-2">
                  <Text className="buttonTextBlack text-xl ml-1 mr-5">
                    Date
                  </Text>
                  <View className="w-full  border-t border-stroke" />
                </View>

                <View className="flex-row flex-wrap justify-between gap-2 mt-1">
                  <View className="w-[48%]">
                    <ToggleButton
                      flag={choice2 == '1'}
                      width={'100%'}
                      onPress={(newf) => {
                        handleChoice(newf, '1', setChoice2);
                      }}
                      text="Last 30 days"
                    />
                  </View>
                  <View className="w-[48%]">
                    <ToggleButton
                      flag={choice2 == '2'}
                      width={'100%'}
                      onPress={(newf) => {
                        handleChoice(newf, '2', setChoice2);
                      }}
                      text="Last 14 days"
                    />
                  </View>
                  <View className="w-[48%]">
                    <ToggleButton
                      flag={choice2 == '3'}
                      width={'100%'}
                      onPress={(newf) => {
                        handleChoice(newf, '3', setChoice2);
                      }}
                      text="Last week"
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Reviews list */}
            <View className="w-full bg-white rounded-xl self-center px-5 py-3.5 gap-2">
              <FlatList
                data={applyFilter()}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() =>
                      router.push({
                        pathname: '/mechanic/[id]/viewOtherUser',
                        params: {
                          id: String(id),
                          reviewId: item.ReviewId,
                          mechanicId: item.MechanicId,
                          userId: item.UserId,
                        },
                      })
                    }
                  >
                    <ViewReviews {...item} />
                  </Pressable>
                )}
                initialNumToRender={4}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ gap: 10 }}
                ListEmptyComponent={
                  <Text className="self-center buttonTextBlack">
                    No Reviews Found
                  </Text>
                }
                scrollEnabled={false}
                keyExtractor={(item) => item.ReviewId}
                extraData={query}
              />
            </View>
          </View>

          {/* Claim modal */}
          <Modal
            isVisible={claimVisibile}
            animationIn="slideInRight"
            animationOut="slideOutRight"
            onBackdropPress={() => {
              setClaimVisibile(false);
              setClaimLoading(true);
            }}
            backdropOpacity={0.3}
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              margin: 0,
            }}
          >
            <View className="w-[40%] h-[20%] bg-white border border-black rounded-xl items-center justify-center">
              {/*Add loading*/}
              {claimLoading ? (
                <View className="flex-1 items-center justify-center">
                  <ActivityIndicator size="large" />
                </View>
              ) : isClaimed ? (
                <Text className="buttonTextBlack">Claim Succesful</Text>
              ) : (
                //Add ways to ask for help
                <Text className="text-dangerDarkRed buttonTextBlack">
                  Failed to Claim
                </Text>
              )}
            </View>
          </Modal>

          {/* edit modal */}
          <ShopManager
            mode="edit"
            visible={editVisible}
            onClose={() => setEditVisible(false)}
            data={{ ...mechanic }}
          />
        </ScrollView>
      </KeyboardAvoidingView>
      // </SafeAreaView>
    );
  }
};

export default Details;