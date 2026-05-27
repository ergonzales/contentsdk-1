export function deStructureProps(props: any) {
  if (!props || !props?.fields?.data?.dsEn || !props?.fields?.data?.dsFr) {
    return {
      ResidenceData: {
        combinedResidences: [],
        combinedCareServices: [],
        combinedPromotions: [],
        combinedProvinces: [],
      },
    };
  }

  const {
    fields: { data },
  } = props;

  const {
    dsEn: { residences: residencesEn },
    dsFr: { residences: residencesFr },
    promos: promos,
    careServices: careServices,
    province: province,
  } = data || {};

  const { targetItems: residenceListEn } = residencesEn || {};
  const {
    careService: { targetItems: careServicesList },
  } = careServices || { careService: { targetItems: [] } };
  const {
    promotion: { targetItems: promosList },
  } = promos || { promotion: { targetItems: [] } };
  const {
    province: { targetItems: provincesList },
  } = province || { province: { targetItems: [] } };

  const { targetItems: residenceListFr } = residencesFr || {};

  return (
    (data && {
      ResidenceData: {
        combinedResidences: residenceListEn?.concat(residenceListFr),
        combinedCareServices: careServicesList,
        combinedPromotions: promosList,
        combinedProvinces: provincesList,
      },
    }) ||
    {}
  );
}
