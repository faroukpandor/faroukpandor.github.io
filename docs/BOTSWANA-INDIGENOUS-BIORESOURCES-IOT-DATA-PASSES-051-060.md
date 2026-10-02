# Botswana Indigenous Bioresources — IoT & Data Passes 051–060

**Research date:** 2 October 2026  
**Status:** architecture and validation layer; no claim that a specific deployment has been contracted.

## Pass 051 — Soil sensing

For cultivated indigenous crops, soil data should support decisions rather than become technology for its own sake.

Minimum record:
**site ID → timestamp → soil variable → sensor/device → calibration status → reading → quality flag → action.**

Candidate variables include soil moisture, temperature, EC and pH where appropriate. Crop-specific thresholds must be experimentally established.

## Pass 052 — Weather sensing

A field station can record rainfall, air temperature, humidity, wind and solar conditions where relevant.

The purpose is to relate:
**weather → crop response → water use → yield → risk.**

Botswana research has already explored remote sensing for drought monitoring, while BITRI currently describes climate data, modelling and climate-smart agriculture as active capability areas. citeturn0search5turn0search11

## Pass 053 — Water monitoring

Water is a critical commercial variable.

Possible measurements:
- tank level
- borehole/pump runtime
- flow
- irrigation event
- estimated volume
- energy consumed
- leakage/abnormal flow

The commercial KPI should be **usable output per unit of water and energy**, not number of sensors installed.

## Pass 054 — Irrigation monitoring

An irrigation record should connect:
**weather + soil moisture + irrigation event + water volume + crop stage + yield.**

Automation should initially be advisory/logging. Automatic actuation should only follow validated agronomic rules, equipment safeguards and fail-safe testing.

## Pass 055 — Processing sensors

For morama and other indigenous ingredients, processing data can record:
**batch → input mass → process → temperature → time → equipment → operator → output mass → losses → QC result.**

This creates a bridge between the processing passes 031–040 and a future traceability system.

## Pass 056 — Storage monitoring

Storage monitoring can cover temperature, humidity, door/open events and time-in-storage where those variables materially affect product quality.

Do not specify a universal threshold. The required range depends on the actual product, package and validated shelf-life study.

## Pass 057 — Batch traceability

Every commercial batch should be reconstructable:

**resource/provenance → producer → harvest → processing → testing → packaging → storage → dispatch → customer.**

A simple batch ID can remain portable even if the software platform changes.

Suggested ID structure:
**BIO-SPECIES-SITE-DATE-BATCH**

Avoid putting personal information into public identifiers.

## Pass 058 — Offline-first data

AgriSage360 should treat connectivity as optional.

Minimum local workflow:
**capture → validate → store locally → timestamp → queue sync → sync when available → reconcile → export.**

The system must remain useful during connectivity outages and permit CSV/JSON export for recovery.

This is consistent with the resilience doctrine already established in the project.

## Pass 059 — Low-power communications

Potential communication layers include Bluetooth, Wi-Fi, LoRa/other LPWAN technologies, cellular and local gateway networks.

Selection criteria:
**range + terrain + power + data volume + device cost + gateway requirement + maintenance + local coverage + failure mode.**

Do not lock the project to one radio technology before field testing.

BITRI currently describes wireless sensor networks for agriculture, water and environmental monitoring, including edge devices, gateways, localised servers, dashboards and alerts. citeturn0search0

BIUST has also documented a Botswana research prototype for real-time crop monitoring using wireless sensor networks/Zigbee, demonstrating that this is an established local research direction rather than a purely imported concept. citeturn0search10turn0search12

## Pass 060 — Dashboard and reporting

The first dashboard should answer operational questions:

1. What is happening?
2. What changed?
3. Which batch/site/device is affected?
4. What action is due?
5. What evidence supports the alert?
6. What happened after the action?

Avoid building a visually impressive dashboard that lacks validated decision rules.

## Reference architecture

**Field/resource layer**
→ sensors/manual observations  
→ **edge layer**
→ local validation/storage  
→ **communications layer**
→ optional gateway/network  
→ **data layer**
→ portable records  
→ **application layer**
→ AgriSage360  
→ **reporting layer**
→ farmer / processor / coordinator  
→ **commercial layer**
→ evidence, cost, quality, traceability, customer outcome.

## Local capability routing

BITRI's Electronic & Communications Division currently lists embedded/control systems, electronics manufacturing, wireless sensor networks, edge devices/gateways, dashboards, alerts, product development, testing and technology transfer. citeturn0search0turn0search4

NARDI's programme structure includes agricultural engineering/mechanisation, field crops/horticulture, food science/technology, agricultural economics/statistics and natural-resource management, creating a potential multidisciplinary evidence route. This does **not** imply a partnership or Farouk's eligibility; any engagement would require a real requirement and authorization. citeturn0search7

## IoT commercial gate

**Problem → measurement requirement → variable → specification → sensor/device → field test → data quality → decision rule → customer outcome → economics → repeat.**

A sensor is not a product-market fit.

## Next recursion

Passes **061–070:** current prices, supplier quotations, equipment landed cost, packaging, processing, laboratory costs, logistics, working capital, contribution margin and break-even.
