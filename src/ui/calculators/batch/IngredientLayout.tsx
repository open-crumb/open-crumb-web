"use client";

import { Button } from "@/ui/design/button";
import { Label } from "@/ui/design/label";
import { ChevronsDownUpIcon, CircleAlertIcon, EditIcon } from "lucide-react";
import { createContext, useContext, useId, useState } from "react";
import { Column, Row } from "@/ui/calculators/batch/RowLayout";

type IngredientContainerProps = {
	className?: string;
	children: React.ReactNode;
};

export function IngredientContainer({
	className,
	children,
}: IngredientContainerProps) {
	return <Row className={className}>{children}</Row>;
}

type IngredientLabelProps = {
	htmlFor?: string;
	isValid?: boolean;
	children: React.ReactNode;
};

export function IngredientLabel({
	htmlFor,
	isValid = true,
	children,
}: IngredientLabelProps) {
	return (
		<Column size="3/4">
			<Label htmlFor={htmlFor}>
				{children}
				{!isValid && (
					<CircleAlertIcon className="ml-sm text-destructive inline-block h-4 w-4" />
				)}
			</Label>
		</Column>
	);
}

type IngredientInputProps = {
	children: React.ReactNode;
};

export function IngredientInput({ children }: IngredientInputProps) {
	return <Column size="1/4">{children}</Column>;
}

type ExpandableIngredientContextValue = {
	isExpanded: boolean;
	setIsExpanded: (isExpanded: boolean) => void;
};

const ExpandableIngredientContext =
	createContext<ExpandableIngredientContextValue>({
		isExpanded: false,
		setIsExpanded: () => {},
	});

type ExpandableIngredientContainerProps = {
	children: React.ReactNode;
};

export function ExpandableIngredientContainer({
	children,
}: ExpandableIngredientContainerProps) {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<ExpandableIngredientContext value={{ isExpanded, setIsExpanded }}>
			<div>{children}</div>
		</ExpandableIngredientContext>
	);
}

type ExpandableIngredientLabelProps = {
	isValid?: boolean;
	children: React.ReactNode;
};

export function ExpandableIngredientLabel({
	isValid = true,
	children,
}: ExpandableIngredientLabelProps) {
	const toggleButtonID = useId();
	const { isExpanded, setIsExpanded } = useContext(ExpandableIngredientContext);

	return (
		<Column size="3/4">
			<div className="gap-md flex items-center">
				<div className="flex-1">
					<Label htmlFor={toggleButtonID}>
						{children}
						{!isValid && (
							<CircleAlertIcon className="ml-sm text-destructive inline-block h-4 w-4" />
						)}
					</Label>
				</div>
				<div className="flex-0">
					<Button
						id={toggleButtonID}
						size="icon"
						variant="outline"
						onClick={() => setIsExpanded(!isExpanded)}
					>
						{!isExpanded && (
							<>
								<span className="sr-only">Expand</span>
								<EditIcon className="h-4 w-4" />
							</>
						)}
						{isExpanded && (
							<>
								<span className="sr-only">Minimize</span>
								<ChevronsDownUpIcon className="h-4 w-4" />
							</>
						)}
					</Button>
				</div>
			</div>
		</Column>
	);
}

type ExpandableIngredientContentProps = {
	children: React.ReactNode;
};

export function ExpandableIngredientContent({
	children,
}: ExpandableIngredientContentProps) {
	const { isExpanded } = useContext(ExpandableIngredientContext);

	return isExpanded ? (
		<div className="mt-md pb-md border-b">{children}</div>
	) : null;
}

type CollapsedIngredientContentProps = {
	children: React.ReactNode;
};

export function CollapsedIngredientContent({
	children,
}: CollapsedIngredientContentProps) {
	const { isExpanded } = useContext(ExpandableIngredientContext);

	return !isExpanded ? (
		<div className="mt-sm pb-md border-b">{children}</div>
	) : null;
}
