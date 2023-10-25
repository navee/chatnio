import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { mobile } from "../utils.ts";
import { useEffect, useState } from "react";
import { Badge } from "./ui/badge.tsx";
import {toggleEvent} from "../events/model.ts";

export type SelectItemBadgeProps = {
  variant: "default" | "gold";
  name: string;
};

export type SelectItemProps = {
  name: string;
  value: string;
  badge?: SelectItemBadgeProps;
  tag?: any;
};

type SelectGroupProps = {
  current: SelectItemProps;
  list: SelectItemProps[];
  onChange?: (select: string) => void;
  maxElements?: number;
};

function GroupSelectItem(props: SelectItemProps) {
  return (
    <>
      {props.value}
      {props.badge && (
        <Badge className={`select-element badge ml-1 badge-${props.badge.variant}`}>
          {props.badge.name}
        </Badge>
      )}
    </>
  );
}

function SelectGroupDesktop(props: SelectGroupProps) {
  const max: number = props.maxElements || 5;
  const range = props.list.length > max ? max : props.list.length;
  const display = props.list.slice(0, range);
  const hidden = props.list.slice(range);

  return (
    <div className={`select-group`}>
      {display.map((select: SelectItemProps, idx: number) => (
        <div
          key={idx}
          onClick={() => props.onChange?.(select.name)}
          className={`select-group-item ${
            select == props.current ? "active" : ""
          }`}
        >
          <GroupSelectItem {...select} />
        </div>
      ))}

      {props.list.length > max && (
        <Select
          defaultValue={"..."}
          value={props.current?.name || "..."}
          onValueChange={(value: string) => props.onChange?.(value)}
        >
          <SelectTrigger
            className={`w-max gap-1 select-group-item ${
              hidden.includes(props.current) ? "active" : ""
            }`}
          >
            <SelectValue asChild>
              <span>
                {hidden.includes(props.current) ? props.current.value : "..."}
              </span>
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {hidden.map((select: SelectItemProps, idx: number) => (
              <SelectItem key={idx} value={select.name}>
                <GroupSelectItem {...select} />
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}

function SelectGroupMobile(props: SelectGroupProps) {
  return (
    <Select
      value={props.current.name}
      onValueChange={(value: string) => {
        toggleEvent.emit(new Date().getTime());
        props.onChange?.(value);
      }}
    >
      <SelectTrigger className="select-group mobile">
        <SelectValue placeholder={props.current.value} />
      </SelectTrigger>
      <SelectContent onCloseAutoFocus={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleEvent.emit(new Date().getTime());
      }}>
        {props.list.map((select: SelectItemProps, idx: number) => (
          <SelectItem key={idx} value={select.name}>
            <GroupSelectItem {...select} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SelectGroup(props: SelectGroupProps) {
  const [state, setState] = useState(mobile);
  useEffect(() => {
    window.addEventListener("resize", () => {
      setState(mobile);
    });
  }, []);

  return state ? (
    <SelectGroupMobile {...props} />
  ) : (
    <SelectGroupDesktop {...props} />
  );
}

export default SelectGroup;
