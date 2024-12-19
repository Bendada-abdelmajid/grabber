import BackBtn from "@/components/back-btn";
import CartItem from "@/components/cart-item";
import { useAppContext } from "@/hooks/app-context";
import { FlatList } from "react-native";
import { Text } from "react-native";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { formatPrice } from "@/libs/utils";
import { Link } from "expo-router";
import EmptySate from "@/components/empty-state";

const Cart = () => {
  const { cart } = useAppContext();
  const count = cart.reduce((a, b) => a + b.count, 0);
  const totale = cart.reduce((a, b) => a + b.total, 0);
  return (
    <SafeAreaView className="flex-1 relative  bg-white ">
      {cart.length>0 ? (
        <View className="flex-1 pt-6 px-5">
          <View className="flex-row items-center gap-10">
            <BackBtn />
            <Text className="text-center text-xl font-400">
              Shopping Cart ({count})
            </Text>
          </View>

          <View className="flex-1 mt-12">
            <FlatList
              showsVerticalScrollIndicator={false}
              bounces={false}
              overScrollMode="never"
              style={{ flex: 0 }}
              className="w-full"
              data={cart}
              contentContainerStyle={{ flex: 0, paddingBottom: 20, gap: 15 }}
              keyExtractor={(item) => item.product.id}
              renderItem={({ item, index }) => (
                <CartItem item={item} index={index} />
              )}
            />
          </View>
          <View className="bg-neutral rounded-2xl py-4 gap-3 px-5">
            <View className="flex-row items-center gap-3 ">
              <Text className="flex-1 text-lg font-400 opacity-70">
                Sub Total
              </Text>
              <Text className="text-lg font-600 font-semibold">
                {formatPrice(totale)}
              </Text>
            </View>
            <View className="flex-row items-center  gap-3">
              <Text className="flex-1 text-lg font-400 opacity-70">
                Delivery
              </Text>
              <Text className="text-lg font-600 font-semibold">
                {formatPrice(2.0)}
              </Text>
            </View>
            <View className="flex-row items-center  gap-3">
              <Text className="flex-1 text-lg font-400 opacity-70">
                Total Amount
              </Text>
              <Text className="text-xl font-600 font-semibold">
                {formatPrice(totale + 2.0)}
              </Text>
            </View>
            <Link href={"/checkout"} className="mt-5">
              <View className="w-full  px-8 py-4  bg-[#4aa556] rounded-[40px]">
                <Text className="text-white  text-center font-600 font-semibold text-lg">
                  Proceed To checkout
                </Text>
              </View>
            </Link>
          </View>
        </View>
      ) : (
        <EmptySate
          title="No Product"
          description="Go find the products you like."
          imageSource={require("@/assets/images/emptys/cart.png")}
          buttonText="Add Product"
          url="/(app)/(tabs)/categorys"
        />
      )}
    </SafeAreaView>
  );
};

export default Cart;
