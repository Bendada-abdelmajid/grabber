import BackBtn from '@/components/back-btn';
import VisaIcon from '@/components/icons/visa-icon';
import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, Pressable, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { generateUniqueId } from '@/libs/utils';
import { Card } from '@/libs/types';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useAppContext } from '@/hooks/app-context';
const itailState = {
    id: '',
    nameOnCard: '',
    cardNumber: '5417',
    expiryDate: '',
    cvv: '',
}
const AddCard = () => {
    const { user } = useAppContext()
    const cards = user.creditCards
    const { cardId, back } = useLocalSearchParams();
    const router = useRouter()

    const usersCollection = firestore().collection('users');

    const cardNumber = Array.from({ length: 16 }, (_, index) => index)
    const [loading, setLoading] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [card, setCard] = useState<Card>(itailState);
    useEffect(() => {
        if (cardId && cards) {
            console.log(cards.find(el => el.id == cardId))
            setCard(cards.find(el => el.id == cardId) || itailState)
        }
    }, [cardId])


    const handleInputChange = (field: keyof Card, value: string) => {
        setCard({ ...card, [field]: value });
    };

    const handleSave = async () => {
        console.log(user.uid)
        let updatedCards;
        if (!card.nameOnCard || !card.cardNumber || !card.expiryDate || !card.cvv) {
            alert('Please fill in all required fields.');
            return;
        }
        try {
            setLoading(true)
            if (cardId) {
                console.log("update")
                updatedCards = cards?.map(el =>
                    card.id === el.id ? card : el
                );
                console.log("update", updatedCards)
            } else {
                const newCard = { ...card, id: generateUniqueId() }
                console.log("add")
                updatedCards = cards ? [...cards, newCard] : [newCard]
            }

            await usersCollection.doc(user.uid).update({
                creditCards: updatedCards,
            });
            console.log('Card saved:', card);
            Alert.alert("Success", 'Card added successfully!');
        } catch (er) {
            console.log(er)
        } finally {
            setLoading(false)
        }
    };
    const handleDelete = async () => {
        console.log(back)
        try {
            if (cardId) {
                setDeleteLoading(true)
                const updatedCards = cards?.filter(el => el.id != cardId);
                await usersCollection.doc(user.uid).update({
                    creditCards: updatedCards,
                });
                Alert.alert("Success", 'Card deleted successfully!');
            } else {
                Alert.alert("error", 'no card to delete');
            }




        } catch (er) {
            console.log(er)
            Alert.alert("Error", "Something went wrong. Please try again later.");
        } finally {
            setDeleteLoading(false)
            
                router.back()
            
            
        }
    }

    return (
        <SafeAreaView className="flex-1 bg-white pt-5 pb-8 px-5">
            <View className="flex-row items-center gap-5 mb-10">
                <BackBtn />
                <Text className="text-2xl">{cardId ? "Update" : "Add"} Card</Text>
            </View>
            <View className='bg-primary rounded-2xl aspect-[1/.65] overflow-hidden'>

                <View className='absolute top-0 right-0 bg-white/10 w-[60%] aspect-square rounded-full ' style={{ transform: [{ translateX: "50%" }, { translateY: "-20%" }] }} />
                <View className='absolute top-0 right-0 bg-white/10 w-[60%] aspect-square rounded-full ' style={{ transform: [{ translateY: "-50%" }] }} />
                <View className='absolute top-0 right-5'><VisaIcon size={80} />

                </View>
                <View className='absolute bottom-5 right-3  size-12 rounded-full ' style={{ backgroundColor: "#F79E1B" }} />
                <View className='absolute bottom-5 right-10  size-12 rounded-full ' style={{ backgroundColor: "#EB001B" }} />
                <View className='absolute bottom-7 left-5'>
                    <Text className='font-600 text-3xl text-white font-semibold  '>
                        {cardNumber.map((el, i) => {
                            const x = card.cardNumber[i]
                            const n = x ? x : "X"
                            return <Text key={i}>
                                {n}
                                {(i + 1) % 4 === 0 && i !== cardNumber.length - 1 ? ' ' : ''}
                            </Text>
                        })}
                    </Text>
                    <View className='mt-4 flex-row gap-10'>
                        <View>
                            <Text className='font-400 text-xs text-white/80'>Card Holder Name</Text>
                            <Text className='font-500 text-2xl font-medium text-white'>{card.nameOnCard || "xxxxxxxxx"}</Text>
                        </View>
                        <View>
                            <Text className='font-400 text-xs text-white/80'>Expiry date</Text>
                            <Text className='font-500 text-2xl font-medium text-white'>{card.expiryDate || "xx/xx"}</Text>
                        </View>
                    </View>
                </View>

            </View>
            <Text className=' mt-10 font-500 font-medium mb-2'>Name on Card</Text>
            <TextInput
                className='h-14 w-full rounded-lg bg-neutral px-3'
                placeholder="Name on Card"
                value={card.nameOnCard}
                onChangeText={(value) => handleInputChange('nameOnCard', value)}
            />
            <Text className=' mt-5 font-500 font-medium mb-2'>Card Number</Text>
            <TextInput
                className='h-14 w-full rounded-lg bg-neutral px-3'
                placeholder="Card Number"
                keyboardType="numeric"
                maxLength={16}
                value={card.cardNumber}
                onChangeText={(value) => handleInputChange('cardNumber', value)}
            />
            <View className='flex-row gap-5 mt-5'>
                <View className='flex-1'>
                    <Text className='  font-500 font-medium mb-2'>Expiry Date</Text>
                    <TextInput
                        className='h-14 w-full rounded-lg bg-neutral px-3'
                        placeholder="(MM/YY)"
                        value={card.expiryDate}
                        onChangeText={(value) => handleInputChange('expiryDate', value)}
                    />
                </View>
                <View className='flex-1'>
                    <Text className='font-500 font-medium mb-2'>CVV</Text>
                    <TextInput
                        className='h-14 w-full rounded-lg bg-neutral px-3'
                        placeholder="CVV"
                        keyboardType="numeric"
                        maxLength={4}
                        value={card.cvv}
                        onChangeText={(value) => handleInputChange('cvv', value)}
                    />
                </View>
            </View>
            <View className='flex-row items-center gap-5 mt-auto'>
                <Pressable onPress={handleSave} className=" flex-1 py-4 rounded-[40px] bg-primary">
                    {loading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text
                            className="text-xl font-medium font-500 tracking-wider text-center text-white"

                        >
                            Save Card
                        </Text>
                    )}
                </Pressable>
               {cardId &&<Pressable onPress={handleDelete} className=" py-4 px-10 rounded-[40px] bg-red-600">
                    {deleteLoading ? (
                        <ActivityIndicator color="#fff" size="small" />
                    ) : (
                        <Text
                            className="text-xl font-medium font-500 tracking-wider text-center text-white"

                        >
                            Delete
                        </Text>
                    )}
                </Pressable>}
            </View>

        </SafeAreaView>
    );
};



export default AddCard;


