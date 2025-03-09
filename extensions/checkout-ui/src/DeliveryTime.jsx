import {
  reactExtension,
  Heading,
  Select,
  useApi,
  useApplyAttributeChange,
  useAttributeValues,
  useInstructions,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

export default reactExtension("purchase.checkout.contact.render-after", () => (
  <Extension />
));

function Extension() {
  const { query } = useApi();
  const instructions = useInstructions();
  const applyAttributeChange = useApplyAttributeChange();
  const [attributeValue] = useAttributeValues(["お届け時間帯"]);
  const [deliveryTimes, setDeliveryTimes] = useState();
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState(null);

  // メタオブジェクトを取得
  useEffect(() => {
    (async () => {
      const response = await query(`
        query GetMetaobject {
          metaobject(handle: { type: "checkout_settings", handle: "checkout_setting" }) {
            id
            fields {
              key
              value
            }
          }
        }
      `);

      // オブジェクトに変換
      const parsedData = JSON.parse(response.data.metaobject.fields[0].value);

      setDeliveryTimes([
        { value: "", label: "指定なし" },
        ...parsedData.map((time) => ({ value: time, label: time })),
      ]);
    })();
  }, []);

  // Attributesに保存
  useEffect(() => {
    if (
      selectedDeliveryTime !== null &&
      instructions.attributes.canUpdateAttributes
    ) {
      (async () => {
        const result = await applyAttributeChange({
          type: "updateAttribute",
          key: "お届け時間帯",
          value: selectedDeliveryTime,
        });

        if (result.type === "error") {
          console.error("[DeliveryTime.jsx]" + result.message);
        }
      })();
    }
  }, [selectedDeliveryTime]);

  if (deliveryTimes !== undefined) {
    return (
      <>
        <Heading id="delivery-time-heading" level="1">
          お届け時間帯
        </Heading>
        <Select
          id="delivery-time-select"
          label="お届け時間帯"
          value={attributeValue || ""}
          onChange={(value) => setSelectedDeliveryTime(value)}
          options={deliveryTimes}
        />
      </>
    );
  }
}
