import { useEffect, useState } from "react";
import { Button, ButtonText } from "@/components/ui/button";
import { SafeAreaView } from "react-native-safe-area-context";
import { Image } from "expo-image";
import { Dimensions, RefreshControl, ScrollView } from "react-native";
import { FlashList } from "@shopify/flash-list";
import { useQuery, useInfiniteQuery } from "@tanstack/react-query";

import { HStack } from "@/components/ui/hstack";
import { Pressable } from "@/components/ui/pressable";
import Cart from "@/components/shop/Cart";
import Title from "@/components/shop/Title";
import { VStack } from "@/components/ui/vstack";
import Category from "@/components/shop/Category";
import Product from "@/components/shop/Product";
// import { MoveUpRight } from "lucide-react-native";
import { Box } from "@/components/ui/box";
import { fetchCategories, fetchProducts } from "@/api/fetch";
import { Text } from "@/components/ui/text";
import { CategoryType } from "@/types";
import { Skeleton } from "@/components/ui/skeleton";
import { Grid, GridItem } from "@/components/ui/grid";
import { useRefreshByUser } from "@/hooks/useRefreshByUser";

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export default function HomeScreen() {
  const [select, setSelect] = useState(0);
  const width = Dimensions.get("screen").width;
  const numColumns = width < 600 ? 2 : width < 768 ? 3 : 4;

  const {
    isPending: isCategoryPending,
    error: categoryError,
    data: categories,
    refetch: refetchCategories,
  } = useQuery<CategoryType[]>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });

  // useEffect(() => {
  //   if(categories) {
  //     setSelect(categories[0].id)
  //   }
  // }, [categories]);

  const {
    data,
    isPending: isProductPending,
    error: productError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch: refetchProducts,
  } = useInfiniteQuery({
    queryKey: ["products", select],
    queryFn: ({ pageParam }) =>
      fetchProducts({ pageParam, categoryId: select }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
    staleTime: 5 * 60 * 1000, //5 min
    enabled: !!select, // Only run if select is defined
  });

  const flatProducts = data?.pages.flatMap((page) => page.products) ?? [];

  const {isRefreshingByUser, refetchByUser} = useRefreshByUser(refetchProducts);

  const handleSelect = (id: number) => {
    setSelect(id);
  };

  if (categoryError || productError) {
    return (
      <Box className=" flex-1 items-center justify-center">
        <Text className="mb-4">Error: {categoryError?.message || productError?.message}</Text>
        <Button
          size="md"
          variant="solid"
          action="primary"
          onPress={() => {
            refetchCategories();
            refetchProducts();
          }}
        >
          <ButtonText>Retry</ButtonText>
        </Button>
      </Box>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <HStack className="my-2 items-center justify-between px-5">
        <Pressable>
          <Image
            style={{ width: 50, height: 25 }}
            source={require("@/assets/images/n.png")}
            placeholder={{ blurhash }}
            contentFit="cover"
            transition={1000}
          />
        </Pressable>
        <Pressable className="mr-4">
          <Cart />
        </Pressable>
      </HStack>
      <ScrollView refreshControl={<RefreshControl refreshing={isRefreshingByUser} onRefresh={refetchByUser}/>}>
        <Image
          style={{ width: "100%", aspectRatio: 20 / 9 }}
          source={require("@/data/shop/banner6.png")}
          placeholder={{ blurhash }}
          contentFit="cover"
          transition={1000}
        />
        <VStack className="mt-4 px-5">
          <Title title="Shop By Category" actionText="See All" />
          {isCategoryPending ? (
            <HStack space="4xl" className=" my-4 align-middle">
              {Array.from({ length: 5 }).map((_, index) => (
                <Skeleton
                  key={index}
                  variant="circular"
                  speed={4}
                  className=" h-[56px] w-[56px]"
                />
              ))}
            </HStack>
          ) : (
            <FlashList
              data={categories}
              extraData={select}
              renderItem={({ item }) => (
                <Category {...item} select={select} onSelect={handleSelect} />
              )}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              estimatedItemSize={90}
              showsHorizontalScrollIndicator={false}
            />
          )}
          <Title title="Recommended for You" actionText="See All" />

          {isProductPending && flatProducts.length === 0 ? (
            <Grid
              className=" gap-x-4 gap-y-2"
              _extra={{ className: " grid-cols-12" }}
            >
              {Array.from({ length: 4 }).map((_, index) => (
                <GridItem
                  key={index}
                  className=" h-[300px] p-4"
                  _extra={{ className: "col-span-6" }}
                >
                  <Skeleton
                    variant="circular"
                    speed={4}
                    className=" rounded-lg"
                  />
                </GridItem>
              ))}
            </Grid>
          ) : (
            <FlashList
              data={flatProducts}
              numColumns={numColumns}
              renderItem={({ item }) => <Product {...item} />}
              keyExtractor={(item) => item.id.toString()}
              estimatedItemSize={300}
              showsVerticalScrollIndicator={false} 
              contentContainerClassName="mt-4"
              ListFooterComponent={() => (
                <Box className="h-40">
                  {flatProducts.length === 0 && (
                    <Box className=" mt-4 size-full items-center justify-center rounded-lg bg-slate-400">
                      <Text>Empty Product</Text>
                    </Box>
                  )}
                  {/* <Button className="mx-auto rounded-lg bg-green-400">
                    <ButtonText className="font-bold" size="lg">
                      Explore More
                    </ButtonText>
                    <ButtonIcon as={MoveUpRight} className="ml-1" />
                  </Button> */}
                </Box>
              )}
            />
          )}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
