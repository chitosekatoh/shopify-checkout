import {
  reactExtension,
  Heading,
  useAttributeValues,
  useApplyAttributeChange,
  useInstructions,
  TextField,
} from "@shopify/ui-extensions-react/checkout";
import { useEffect, useState } from "react";

export default reactExtension("purchase.checkout.actions.render-before", () => (
  <Extension />
));

function Extension() {
  const instructions = useInstructions();
  const applyAttributeChange = useApplyAttributeChange();
  const [attributeValue] = useAttributeValues(["配達備考"]);
  const [description, setDescription] = useState(null);

  // Attributesに保存
  useEffect(() => {
    if (description !== null && instructions.attributes.canUpdateAttributes) {
      (async () => {
        const result = await applyAttributeChange({
          type: "updateAttribute",
          key: "配達備考",
          value: description,
        });

        if (result.type === "error") {
          console.error("[DeliveryDescription.jsx]" + result.message);
        }
      })();
    }
  }, [description]);

  return (
    <>
      <Heading id="delivery-description-heading" level="1">
        備考
      </Heading>
      <TextField
        id="delivery-description-text-field"
        multiline="true"
        value={attributeValue || null}
        onChange={(value) => {
          setDescription(value);
        }}
      />
    </>
  );
}
