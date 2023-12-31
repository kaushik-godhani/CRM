import { CrudFilters, CrudSorting, getDefaultFilter } from "@refinedev/core";
import {
    DeleteButton,
    FilterDropdown,
    ShowButton,
    useSelect,
    getDefaultSortOrder,
} from "@refinedev/antd";
import { Button, Input, Select, Space, Table, type TableProps } from "antd";
import { PhoneOutlined } from "@ant-design/icons";

import { ContactStatusEnum } from "../../enums/contact-status";
import { CustomAvatar } from "../custom-avatar";
import { ContactStatusTag } from "./status-tag";
import { Text } from "../text";
import { Contact } from "../../interfaces/graphql";
import { PaginationTotal } from "../pagination-total";

type Props = {
    tableProps: TableProps<Contact>;
    filters: CrudFilters;
    sorters: CrudSorting;
};

const statusOptions = Object.keys(ContactStatusEnum).map((key) => ({
    label: `${key[0]}${key.slice(1).toLowerCase()}`,
    value: ContactStatusEnum[key as keyof typeof ContactStatusEnum],
}));

export const TableView: React.FC<Props> = ({
    tableProps,
    filters,
    sorters,
}) => {
    const { selectProps } = useSelect({
        resource: "companies",
        optionLabel: "name",
        meta: {
            fields: ["id", "name"],
        },
    });

    return (
        <Table
            {...tableProps}
            pagination={{
                ...tableProps.pagination,
                pageSizeOptions: ["12", "24", "48", "96"],
                showTotal: (total) => (
                    <PaginationTotal total={total} entityName="contacts" />
                ),
            }}
            rowKey="id"
        >
            <Table.Column
                dataIndex="name"
                title="Name"
                width={200}
                defaultFilteredValue={getDefaultFilter("name", filters)}
                defaultSortOrder={getDefaultSortOrder("name", sorters)}
                filterDropdown={(props) => (
                    <FilterDropdown {...props}>
                        <Input placeholder="Search Name" />
                    </FilterDropdown>
                )}
                render={(_, record: Contact) => {
                    return (
                        <Space>
                            <CustomAvatar
                                src={record.avatarUrl}
                                name={record.name}
                            />
                            <Text>{record.name}</Text>
                        </Space>
                    );
                }}
            />
            <Table.Column
                dataIndex="email"
                title="Email"
                defaultFilteredValue={getDefaultFilter("email", filters)}
                defaultSortOrder={getDefaultSortOrder("email", sorters)}
                filterDropdown={(props) => (
                    <FilterDropdown {...props}>
                        <Input placeholder="Search Email" />
                    </FilterDropdown>
                )}
            />
            <Table.Column
                dataIndex={["company", "id"]}
                title="Company"
                defaultFilteredValue={getDefaultFilter("company.id", filters)}
                defaultSortOrder={getDefaultSortOrder("company.id", sorters)}
                filterDropdown={(props) => (
                    <FilterDropdown {...props}>
                        <Select
                            placeholder="Search Company"
                            style={{ width: 220 }}
                            {...selectProps}
                        />
                    </FilterDropdown>
                )}
                render={(_, record: Contact) => {
                    return <span>{record?.company.name}</span>;
                }}
            />
            <Table.Column
                dataIndex="jobTitle"
                title="Title"
                filterDropdown={(props) => (
                    <FilterDropdown {...props}>
                        <Input placeholder="Search Title" />
                    </FilterDropdown>
                )}
            />
            <Table.Column
                dataIndex="status"
                title="Status"
                sorter
                defaultFilteredValue={getDefaultFilter("status", filters)}
                defaultSortOrder={getDefaultSortOrder("status", sorters)}
                filterDropdown={(props) => (
                    <FilterDropdown {...props}>
                        <Select
                            style={{ width: "200px" }}
                            defaultValue={null}
                            mode="multiple"
                            options={statusOptions}
                        ></Select>
                    </FilterDropdown>
                )}
                render={(value: ContactStatusEnum) => (
                    <ContactStatusTag status={value} />
                )}
            />
            <Table.Column<Contact>
                fixed="right"
                title="Actions"
                dataIndex="actions"
                render={(_, record) => (
                    <Space>
                        <ShowButton
                            hideText
                            size="small"
                            recordItemId={record.id}
                        />
                        <Button
                            size="small"
                            href="tel:1234567890"
                            icon={<PhoneOutlined />}
                        />
                        <DeleteButton
                            hideText
                            size="small"
                            recordItemId={record.id}
                        />
                    </Space>
                )}
            />
        </Table>
    );
};
