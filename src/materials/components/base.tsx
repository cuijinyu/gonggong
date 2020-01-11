import React, { Component } from 'react';

type MaterialInfoType = {
    icon: string
}

export abstract class BaseMaterial extends Component<{}, MaterialInfoType> {
    abstract getMaterialInfo (): MaterialInfoType;
    abstract setMaterialConfig (): {};
}