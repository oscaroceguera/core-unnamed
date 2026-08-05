import Image from "next/image";
import IconMainMx from "@repo/assets/images/icons/mainMx.svg";
import IconAxolotl from "@repo/assets/images/illustrations/axolotl.svg";
import IconPrimary from "@repo/assets/images/logos/primary.svg";
import { Card } from "@repo/ui/Card";

export function AssetsAccess() {
  return (
    <Card title="Assets consult" color="primary">
      <div className="grid grid-cols-3 items-center justify-items-center">
        <Image src={IconMainMx} alt="Made in mexico" />
        <Image src={IconAxolotl} alt="Axolotl" loading="eager" />
        <Image src={IconPrimary} alt="Brand icon" />
      </div>
    </Card>
  );
}
