import Stack from "@mui/material/Stack";
import Scrollbars from "rc-scrollbars";
import * as React from "react";

import type { Method } from "@/types";

import { TryServiceTabItem } from "./TryServiceTabItem";

interface Props {
  activeMethod: Method;
  methodTabList: Method[];
  onCloseTryServiceTab: (method: Method, index: number) => void;
  onOpenTryServiceTab: (method: Method) => void;
}

export const TryServiceTab = React.memo(function TryServiceTab({
  activeMethod,
  methodTabList,
  onCloseTryServiceTab,
  onOpenTryServiceTab,
}: Props) {
  // const { width } = useWindowDimensions();

  const scrollRef = React.useRef<Scrollbars>();

  // const handleScrollRight = React.useCallback(() => {
  //   const element = scrollRef?.current?.view;
  //   if (element) {
  //     sideScroll(element, "right", 10, 150, 20);
  //   }
  // }, []);

  // const handleScrollLeft = React.useCallback(() => {
  //   const element = scrollRef?.current?.view;
  //   if (element) {
  //     sideScroll(element, "left", 10, 150, 20);
  //   }
  // }, []);

  // const tryServiceWidth = width - 260 - 70;

  // const showArrow = tryServiceWidth - methodTabList.length * 125 < 0;

  return (
    <Stack
      sx={{
        height: "40px",
        width: "100%",
      }}
      direction="row"
      alignItems="stretch"
    >
      {/* {showArrow && (
        <Pressable
          w="10"
          onPress={handleScrollLeft}
          borderColor="gray.300"
          borderWidth="1"
          justifyContent="center"
          alignItems="center"
        >
          <LeftChevron size={5} color="black" />
        </Pressable>
      )} */}
      <Scrollbars
        ref={scrollRef as unknown as React.LegacyRef<Scrollbars>}
        style={{ height: "41px" }}
        autoHide
      >
        <Stack
          sx={{
            background: "white",
            // flex: 1,
            width: "100%",

            // overflow: "auto",
          }}
          direction="row"
          justifyContent="flex-start"
          alignItems="flex-end"
        >
          {methodTabList.map((item, index) => {
            const isActiveMethod = activeMethod.id === item.id;

            return (
              <TryServiceTabItem
                key={item.id}
                index={index}
                isActiveMethod={isActiveMethod}
                method={item}
                tabLength={methodTabList.length}
                onCloseTab={onCloseTryServiceTab}
                onOpen={onOpenTryServiceTab}
              />
            );
          })}
        </Stack>
      </Scrollbars>
      {/* {showArrow && (
        <Pressable
          w="10"
          onPress={handleScrollRight}
          borderColor="gray.300"
          borderWidth="1"
          justifyContent="center"
          alignItems="center"
        >
          <RightChevron size={5} color="black" />
        </Pressable>
      )} */}
    </Stack>
  );
});
