import { Button, Flex, Input, Modal } from "antd";
import { Products } from "../modules/products/products";
import { useRef, useState } from "react";
import { CloseOutlined } from "@ant-design/icons";
import { ProductHistory } from "../modules/history/history";
import { AddProduct } from "../modules/products/addProduct";
import CarAutoComplete from "../modules/products/CarAutoComplete";

const { Search } = Input;
export function Base() {
  const searcParamsObj = {
    name: "",
    type: "",
    oem: "",
    code: "",
    WXQP: "",
  };
  const [searchParams, setSearchParams] = useState(searcParamsObj);
  const [activeFilters, setActiveFilters] = useState(searcParamsObj);
  const [isProductHistoryOpen, setIsProductHistoryOpen] =
    useState<boolean>(false);
  const [isAddProductModalOpen, setIsAddProductModalOpen] =
    useState<boolean>(false);
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const handleSearch = (key: keyof typeof activeFilters, value: string) => {
    if (activeFilters[key] === value) return;
    setActiveFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
          height: "100%",
        }}
      >
        <section id="filter" style={{ flex: "0 0 auto" }}>
          <Flex gap={"middle"} justify="start" wrap="wrap">
            <Search
              allowClear={{ clearIcon: <CloseOutlined /> }}
              placeholder="Code"
              style={{ minWidth: 150, flex: "1 1 150px" }}
              value={searchParams.code}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "");
                setSearchParams((prev) => ({ ...prev, code: value }));
              }}
              onSearch={(value) => handleSearch("code", value)}
            />
            <CarAutoComplete
              style={{ minWidth: 150, flex: "1 1 150px" }}
              value={searchParams.name}
              onChange={(value) =>
                setSearchParams((prev) => ({ ...prev, name: value }))
              }
              onSelect={(value: string) => handleSearch("name", value)}
            >
              <Search
                placeholder="Name"
                allowClear={{ clearIcon: <CloseOutlined /> }}
                onSearch={(value) => handleSearch("name", value)}
              />
            </CarAutoComplete>
            <CarAutoComplete
              style={{ minWidth: 150, flex: "1 1 150px" }}
              value={searchParams.type}
              onChange={(value) =>
                setSearchParams((prev) => ({ ...prev, type: value }))
              }
              onSelect={(value: string) => handleSearch("type", value)}
            >
              <Search
                placeholder="Type"
                allowClear={{ clearIcon: <CloseOutlined /> }}
                onSearch={(value) => handleSearch("type", value)}
              />
            </CarAutoComplete>
            <Search
              placeholder="OEM"
              allowClear={{ clearIcon: <CloseOutlined /> }}
              style={{ minWidth: 150, flex: "1 1 150px" }}
              value={searchParams.oem}
              onChange={(e) =>
                setSearchParams((prev) => ({
                  ...prev,
                  oem: e.target.value,
                }))
              }
              onSearch={(value) => handleSearch("oem", value)}
            />
            <Search
              placeholder="WXQP"
              allowClear={{ clearIcon: <CloseOutlined /> }}
              style={{ minWidth: 150, flex: "1 1 150px" }}
              value={searchParams.WXQP}
              onChange={(e) =>
                setSearchParams((prev) => ({
                  ...prev,
                  WXQP: e.target.value,
                }))
              }
              onSearch={(value) => handleSearch("WXQP", value)}
            />
          </Flex>
        </section>
        <section
          ref={tableContainerRef}
          style={{
            flex: 1,
            minHeight: 0,
            overflow: "hidden",
          }}
          id="main"
        >
          <Products filters={activeFilters} containerRef={tableContainerRef} />
        </section>
        <section id="btns" style={{ flex: "0 0 auto" }}>
          <Flex gap={"middle"} justify="start" wrap="wrap">
            <Button size="large" onClick={() => setIsProductHistoryOpen(true)}>
              History
            </Button>
            <Button size="large" onClick={() => setIsAddProductModalOpen(true)}>
              Add Product
            </Button>
          </Flex>
        </section>
      </div>
      <Modal
        open={isProductHistoryOpen}
        closeIcon={false}
        onCancel={() => setIsProductHistoryOpen(false)}
        footer={(_, { CancelBtn }) => <CancelBtn />}
        width={"fit-content"}
      >
        <ProductHistory />
      </Modal>
      <Modal
        open={isAddProductModalOpen}
        footer={null}
        closeIcon={false}
        maskClosable={false}
        destroyOnClose
        width={720}
      >
        <AddProduct onClose={() => setIsAddProductModalOpen(false)} />
      </Modal>
    </>
  );
}
